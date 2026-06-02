import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOpenAI, DEFAULT_MODEL, temperatureParam } from "@/lib/ai/openai";
import {
  ANALYSIS_SYSTEM_PROMPT,
  buildAnalysisUserPrompt,
  computePerceptionBias,
} from "@/lib/ai/analysis-prompt";
import type { CognitiveDossier } from "@/lib/types/dossier";
import { dossierToDbRow } from "@/lib/types/dossier";
import { QUESTIONS, TOTAL_QUESTIONS, scoreRealityProcessing } from "@/data/questions";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_QUESTION_IDS = new Set(QUESTIONS.map((q) => q.id));

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, age_range, occupation, onboarding_status")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile)
    return NextResponse.json({ error: "Profile missing" }, { status: 400 });

  const { data: responses, error: rErr } = await supabase
    .from("reconstruction_responses")
    .select("*")
    .eq("user_id", user.id);

  if (rErr)
    return NextResponse.json({ error: rErr.message }, { status: 500 });

  const validResponses = (responses ?? []).filter((r) => {
    if (!ALLOWED_QUESTION_IDS.has(r.question_id)) return false;
    if (r.answer_text && r.answer_text.toString().trim().length > 0) return true;
    if (r.answer_choices && r.answer_choices.length > 0) return true;
    return false;
  });

  if (validResponses.length < TOTAL_QUESTIONS) {
    // Auto-recover: send the user back to finish the quiz
    await supabase
      .from("profiles")
      .update({ onboarding_status: "in_progress" })
      .eq("id", user.id);
    return NextResponse.json(
      {
        error: `Only ${validResponses.length} of ${TOTAL_QUESTIONS} assessment items answered. Finish the reconstruction first.`,
        recover: true,
      },
      { status: 400 },
    );
  }

  const order = new Map(QUESTIONS.map((q, i) => [q.id, i]));
  validResponses.sort(
    (a, b) => (order.get(a.question_id) ?? 0) - (order.get(b.question_id) ?? 0),
  );

  const questionById = new Map(QUESTIONS.map((q) => [q.id, q]));

  const answerMap = Object.fromEntries(
    validResponses.map((r) => [
      r.question_id,
      { choices: r.answer_choices ?? undefined },
    ]),
  );
  const realityProcessing = scoreRealityProcessing(answerMap);
  const perceptionBias = computePerceptionBias(realityProcessing);

  const userPrompt = buildAnalysisUserPrompt({
    displayName: profile.display_name ?? "Subject",
    ageRange: profile.age_range,
    occupation: profile.occupation,
    realityProcessing,
    perceptionBias,
    responses: validResponses.map((r) => {
      const q = questionById.get(r.question_id);
      return {
        question_id: r.question_id,
        category: r.category,
        question: r.question_text,
        measured_dimensions: q?.measured_dimensions,
        answer_choices: r.answer_choices,
      };
    }),
  });

  let dossier: CognitiveDossier;
  let raw = "";

  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      ...temperatureParam(DEFAULT_MODEL, 0.55),
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });
    raw = completion.choices[0]?.message?.content ?? "";
    dossier = JSON.parse(raw) as CognitiveDossier;
    dossier.reality_processing_score = {
      correct: realityProcessing.correct,
      total: realityProcessing.total,
      accuracy_pct: realityProcessing.accuracy_pct,
      summary: dossier.reality_processing_score?.summary ?? "",
    };
    dossier.perception_calibration = {
      ...dossier.perception_calibration,
      accuracy_pct: realityProcessing.accuracy_pct,
      bias_level: perceptionBias.bias_level,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "AI synthesis failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const { error: insertErr } = await supabase.from("cognitive_dossiers").insert({
    user_id: user.id,
    version: 1,
    ...dossierToDbRow(dossier),
    raw_model_output: raw,
  });

  if (insertErr)
    return NextResponse.json({ error: insertErr.message }, { status: 500 });

  if (dossier.memory_seeds?.length) {
    const memoryRows = dossier.memory_seeds.map((m) => ({
      user_id: user.id,
      memory_type: m.memory_type,
      content: m.content,
      evidence: m.evidence ?? null,
      weight: 1.0,
    }));
    await supabase.from("cognitive_memory").insert(memoryRows);
  }

  await supabase
    .from("profiles")
    .update({
      onboarding_status: "complete",
      reconstruction_complete_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  return NextResponse.json({ ok: true });
}
