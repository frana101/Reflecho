import { createClient } from "@/lib/supabase/server";
import { computePerceptionBias } from "@/lib/ai/analysis-prompt";
import { QUESTIONS, TOTAL_QUESTIONS, scoreRealityProcessing } from "@/data/questions";

const ALLOWED_QUESTION_IDS = new Set(QUESTIONS.map((q) => q.id));

export type AnalysisContext =
  | { ok: true; userId: string; input: import("@/lib/ai/analysis-prompt").AnalysisPromptInput }
  | { ok: false; status: number; error: string; recover?: boolean; recovered?: boolean };

export async function loadAnalysisContext(): Promise<AnalysisContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401, error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, age_range, occupation, onboarding_status")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return { ok: false, status: 400, error: "Profile missing" };

  const { data: existingDossier } = await supabase
    .from("cognitive_dossiers")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingDossier) {
    await supabase
      .from("profiles")
      .update({
        onboarding_status: "complete",
        reconstruction_complete_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    return { ok: false, status: 200, error: "", recovered: true };
  }

  const { data: responses, error: rErr } = await supabase
    .from("reconstruction_responses")
    .select("*")
    .eq("user_id", user.id);

  if (rErr) return { ok: false, status: 500, error: rErr.message };

  const validResponses = (responses ?? []).filter((r) => {
    if (!ALLOWED_QUESTION_IDS.has(r.question_id)) return false;
    if (r.answer_text && r.answer_text.toString().trim().length > 0) return true;
    if (r.answer_choices && r.answer_choices.length > 0) return true;
    return false;
  });

  if (validResponses.length < TOTAL_QUESTIONS) {
    await supabase
      .from("profiles")
      .update({ onboarding_status: "in_progress" })
      .eq("id", user.id);
    return {
      ok: false,
      status: 400,
      error: `Only ${validResponses.length} of ${TOTAL_QUESTIONS} assessment items answered. Finish the reconstruction first.`,
      recover: true,
    };
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

  return {
    ok: true,
    userId: user.id,
    input: {
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
          question: r.question_text ?? q?.question ?? "",
          measured_dimensions: q?.measured_dimensions,
          answer_choices: r.answer_choices,
        };
      }),
    },
  };
}

export async function saveDossier(
  userId: string,
  dossier: import("@/lib/types/dossier").CognitiveDossier,
  raw: string,
  realityProcessing: ReturnType<typeof scoreRealityProcessing>,
  perceptionBias: ReturnType<typeof computePerceptionBias>,
) {
  const supabase = await createClient();
  const { dossierToDbRow } = await import("@/lib/types/dossier");

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

  const { error: insertErr } = await supabase.from("cognitive_dossiers").insert({
    user_id: userId,
    version: 1,
    ...dossierToDbRow(dossier),
    raw_model_output: raw,
  });

  if (insertErr) return { ok: false as const, error: insertErr.message };

  if (dossier.memory_seeds?.length) {
    const memoryRows = dossier.memory_seeds.map((m) => ({
      user_id: userId,
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
    .eq("id", userId);

  return { ok: true as const };
}
