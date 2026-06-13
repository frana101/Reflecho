import { NextResponse } from "next/server";
import {
  ANALYSIS_SYSTEM_PROMPT,
  buildAnalysisUserPrompt,
} from "@/lib/ai/analysis-prompt";
import {
  synthesizeDossier,
  synthesisErrorResponse,
  validateFullDossier,
} from "@/lib/ai/synthesize-dossier";
import { loadAnalysisContext, saveDossier } from "@/lib/reconstruction/analysis-context";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST() {
  const ctx = await loadAnalysisContext();
  if (!ctx.ok) {
    if (ctx.recovered) return NextResponse.json({ ok: true, recovered: true });
    return NextResponse.json(
      { error: ctx.error, recover: ctx.recover },
      { status: ctx.status },
    );
  }

  const userPrompt = buildAnalysisUserPrompt(ctx.input);
  const result = await synthesizeDossier(ANALYSIS_SYSTEM_PROMPT, userPrompt);
  if (!result.ok) {
    return NextResponse.json(synthesisErrorResponse(result), { status: 500 });
  }

  const validated = validateFullDossier(result.dossier);
  if (!validated.ok) {
    return NextResponse.json(synthesisErrorResponse(validated), { status: 500 });
  }

  const saved = await saveDossier(ctx.userId, result.dossier, result.raw);
  if (!saved.ok) {
    return NextResponse.json({ error: saved.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
