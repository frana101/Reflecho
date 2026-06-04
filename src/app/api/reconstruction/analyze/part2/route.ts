import { NextResponse } from "next/server";
import type { CognitiveDossier } from "@/lib/types/dossier";
import {
  ANALYSIS_SYSTEM_PROMPT_PART2,
  buildAnalysisUserPromptPart2,
} from "@/lib/ai/analysis-prompt";
import {
  mergeDossierParts,
  synthesizeDossier,
  synthesisErrorResponse,
  validatePart2Dossier,
} from "@/lib/ai/synthesize-dossier";
import { loadAnalysisContext, saveDossier } from "@/lib/reconstruction/analysis-context";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const ctx = await loadAnalysisContext();
  if (!ctx.ok) {
    if (ctx.recovered) return NextResponse.json({ ok: true, recovered: true });
    return NextResponse.json(
      { error: ctx.error, recover: ctx.recover },
      { status: ctx.status },
    );
  }

  let body: { partial?: CognitiveDossier; raw?: string };
  try {
    body = (await req.json()) as { partial?: CognitiveDossier; raw?: string };
  } catch {
    return NextResponse.json({ error: "Missing partial dossier from phase 1." }, { status: 400 });
  }

  if (!body.partial?.core_diagnosis || !body.partial?.hierarchy) {
    return NextResponse.json({ error: "Invalid partial dossier from phase 1." }, { status: 400 });
  }

  const userPrompt = buildAnalysisUserPromptPart2(ctx.input, body.partial);
  const result = await synthesizeDossier(ANALYSIS_SYSTEM_PROMPT_PART2, userPrompt);
  if (!result.ok) {
    return NextResponse.json(synthesisErrorResponse(result), { status: 500 });
  }

  const validated = validatePart2Dossier(result.dossier);
  if (!validated.ok) {
    return NextResponse.json(synthesisErrorResponse(validated), { status: 500 });
  }

  const dossier = mergeDossierParts(body.partial, result.dossier);
  const raw = [body.raw, result.raw].filter(Boolean).join("\n---\n");

  const saved = await saveDossier(
    ctx.userId,
    dossier,
    raw,
    ctx.input.realityProcessing,
    ctx.input.perceptionBias,
  );
  if (!saved.ok) {
    return NextResponse.json({ error: saved.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
