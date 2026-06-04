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
  if (!dossier.core_diagnosis || !dossier.hierarchy) {
    return {
      ok: false,
      kind: "incomplete",
      error: "Analysis completed but the response was incomplete. Try retry synthesis.",
    };
  }
  return { ok: true, dossier, raw: "" };
}

export function validatePart1Dossier(dossier: CognitiveDossier): SynthesisResult {
  if (!dossier.core_diagnosis || !dossier.hierarchy || !dossier.radar_scores) {
    return {
      ok: false,
      kind: "incomplete",
      error: "Phase 1 synthesis was incomplete. Try again.",
    };
  }
  return { ok: true, dossier, raw: "" };
}

export function validatePart2Dossier(dossier: Partial<CognitiveDossier>): SynthesisResult {
  if (!dossier.evidence_chains?.length || !dossier.behavioral_predictions?.length) {
    return {
      ok: false,
      kind: "incomplete",
      error: "Phase 2 synthesis was incomplete. Try again.",
    };
  }
  return { ok: true, dossier: dossier as CognitiveDossier, raw: "" };
}

export function mergeDossierParts(
  part1: CognitiveDossier,
  part2: Partial<CognitiveDossier>,
): CognitiveDossier {
  return { ...part1, ...part2 };
}

export function synthesisErrorResponse(result: Extract<SynthesisResult, { ok: false }>) {
  return { error: result.error, kind: result.kind };
}
