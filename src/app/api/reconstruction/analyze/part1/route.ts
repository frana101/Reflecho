import { NextResponse } from "next/server";
import {
  ANALYSIS_SYSTEM_PROMPT_PART1,
  buildAnalysisUserPromptPart1,
} from "@/lib/ai/analysis-prompt";
import {
  synthesizeDossier,
  synthesisErrorResponse,
  validatePart1Dossier,
} from "@/lib/ai/synthesize-dossier";
import { loadAnalysisContext } from "@/lib/reconstruction/analysis-context";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST() {
  const ctx = await loadAnalysisContext();
  if (!ctx.ok) {
    if (ctx.recovered) return NextResponse.json({ ok: true, recovered: true });
    return NextResponse.json(
      { error: ctx.error, recover: ctx.recover },
      { status: ctx.status },
    );
  }

  const userPrompt = buildAnalysisUserPromptPart1(ctx.input);
  const result = await synthesizeDossier(ANALYSIS_SYSTEM_PROMPT_PART1, userPrompt);
  if (!result.ok) {
    return NextResponse.json(synthesisErrorResponse(result), { status: 500 });
  }

  const validated = validatePart1Dossier(result.dossier);
  if (!validated.ok) {
    return NextResponse.json(synthesisErrorResponse(validated), { status: 500 });
  }

  return NextResponse.json({ ok: true, partial: result.dossier, raw: result.raw });
}
