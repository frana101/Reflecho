import { getOpenAI, DEFAULT_MODEL, temperatureParam } from "@/lib/ai/openai";
import type { CognitiveDossier } from "@/lib/types/dossier";

export type SynthesisResult =
  | { ok: true; dossier: CognitiveDossier; raw: string }
  | { ok: false; error: string; kind: "empty" | "incomplete" | "json" | "api" };

export async function synthesizeDossier(
  systemPrompt: string,
  userPrompt: string,
): Promise<SynthesisResult> {
  let raw = "";
  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      ...temperatureParam(DEFAULT_MODEL, 0.55),
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    raw = completion.choices[0]?.message?.content ?? "";
    if (!raw.trim()) {
      return {
        ok: false,
        kind: "empty",
        error: "OpenAI returned an empty response. Check your API key and model name.",
      };
    }
    const dossier = JSON.parse(raw) as CognitiveDossier;
    return { ok: true, dossier, raw };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "AI synthesis failed.";
    if (e instanceof SyntaxError) {
      return { ok: false, kind: "json", error: `Invalid JSON from model: ${msg}. Try again.` };
    }
    if (msg.includes("OPENAI_API_KEY")) {
      return { ok: false, kind: "api", error: "OPENAI_API_KEY is not set on the server." };
    }
    return { ok: false, kind: "api", error: msg };
  }
}

export function validateFullDossier(dossier: CognitiveDossier): SynthesisResult {
  if (!dossier.core_diagnosis?.trim()) {
    return {
      ok: false,
      kind: "incomplete",
      error: "Analysis completed but core diagnosis was missing. Try again.",
    };
  }
  if (!dossier.one_sentence_truth?.trim()) {
    return {
      ok: false,
      kind: "incomplete",
      error: "Analysis completed but one sentence truth was missing. Try again.",
    };
  }
  if (!dossier.archetype?.name?.trim()) {
    return {
      ok: false,
      kind: "incomplete",
      error: "Analysis completed but archetype was missing. Try again.",
    };
  }
  if (!dossier.opening_message?.trim()) {
    return {
      ok: false,
      kind: "incomplete",
      error: "Analysis completed but opening message was missing. Try again.",
    };
  }
  if (
    !dossier.drivers?.length ||
    !dossier.threats?.length ||
    !dossier.constraints?.length ||
    !dossier.action_plan?.length ||
    dossier.action_plan.length < 5
  ) {
    return {
      ok: false,
      kind: "incomplete",
      error: "Analysis completed but the report was incomplete. Try again.",
    };
  }
  if (!dossier.mechanism_map?.length || dossier.mechanism_map.length < 4) {
    return {
      ok: false,
      kind: "incomplete",
      error: "Analysis completed but mechanism map was incomplete. Try again.",
    };
  }
  if (!dossier.blind_spots?.length || dossier.blind_spots.length < 4) {
    return {
      ok: false,
      kind: "incomplete",
      error: "Analysis completed but blind spots were incomplete. Try again.",
    };
  }
  if (!dossier.self_deception?.length || dossier.self_deception.length < 3) {
    return {
      ok: false,
      kind: "incomplete",
      error: "Analysis completed but self-deception section was incomplete. Try again.",
    };
  }
  if (!dossier.predictions?.length || dossier.predictions.length < 5) {
    return {
      ok: false,
      kind: "incomplete",
      error: "Analysis completed but predictions were incomplete. Try again.",
    };
  }
  return { ok: true, dossier, raw: "" };
}

export function synthesisErrorResponse(result: Extract<SynthesisResult, { ok: false }>) {
  return { error: result.error, kind: result.kind };
}
