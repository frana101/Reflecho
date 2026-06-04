import type { CognitiveDossier, PerceptionQuadrant } from "@/lib/types/dossier";
import { CATEGORIES, TOTAL_QUESTIONS, type RealityProcessingScore } from "@/data/questions";

export interface AnalysisPromptInput {
  displayName: string;
  ageRange?: string | null;
  occupation?: string | null;
  realityProcessing: RealityProcessingScore;
  perceptionBias: {
    bias_level: "low" | "moderate" | "high";
    cynical_wrong_pct: number;
    suggested_quadrant_hint: PerceptionQuadrant;
  };
  responses: {
    question_id: string;
    category: string;
    question: string;
    measured_dimensions?: string[] | null;
    answer_choices?: string[] | null;
  }[];
}

const OUTPUT_LIMITS = `Keep output compact: top-3 hierarchy items per list; 4 evidence_chains; 3 root_causes; 4 self_deception items; 5 behavioral_predictions; 3 bullets per dimension section; 6 memory_seeds max. Tight prose.`;

export const ANALYSIS_JSON_SCHEMA = `{
  "core_diagnosis": string,
  "summary": string,
  "hierarchy": {
    "core_drivers": [{ "rank": number, "label": string, "score_pct": number, "explanation": string, "evidence": string[], "confidence": "weak"|"moderate"|"strong", "confidence_pct": number }],
    "core_threats": [{ "rank": number, "label": string, "score_pct": number, "explanation": string, "evidence": string[], "confidence": "weak"|"moderate"|"strong", "confidence_pct": number }],
    "core_constraints": [{ "rank": number, "label": string, "score_pct": number, "explanation": string, "evidence": string[], "confidence": "weak"|"moderate"|"strong", "confidence_pct": number }]
  },
  "perception_calibration": {
    "accuracy_pct": number,
    "bias_level": "low"|"moderate"|"high",
    "quadrant": "elite"|"pattern_seer"|"misses_manipulation"|"paranoid_interpreter",
    "summary": string
  },
  "reality_processing_score": { "correct": number, "total": number, "accuracy_pct": number, "summary": string },
  "archetypes": {
    "primary": { "name": string, "score_pct": number, "core_drive": string, "weapon": string, "blind_spot": string },
    "secondary": { "name": string, "score_pct": number, "core_drive": string, "weapon": string, "blind_spot": string },
    "shadow": { "name": string, "score_pct": number, "core_drive": string, "weapon": string, "blind_spot": string }
  },
  "evidence_chains": [{
    "claim": string,
    "chain": [{ "question_id": string, "signal": string }],
    "inference": string,
    "confidence_pct": number,
    "evidence_count": number,
    "counter_evidence": string[],
    "counter_evidence_count": number
  }],
  "mechanism_map": [{ "driver": string, "threat": string, "coping_strategy": string, "behavior": string }],
  "root_causes": [{ "rank": number, "mechanism": string, "explains": string[], "coverage_pct": number, "confidence_pct": number, "evidence": string[] }],
  "self_deception_detector": [{ "claim": string, "evidence_for": string[], "evidence_against": string[], "inference": string, "confidence_pct": number }],
  "behavioral_predictions": [{ "situation": string, "prediction": string, "mechanism": string, "confidence_pct": number }],
  "strategic_adaptations": string[],
  "reality_processing": { "summary": string, "bullets": string[], "confidence_pct": number },
  "decision_architecture": { "summary": string, "bullets": string[], "confidence_pct": number },
  "identity_architecture": { "summary": string, "bullets": string[], "confidence_pct": number },
  "threat_architecture": { "summary": string, "bullets": string[], "confidence_pct": number },
  "social_operating_system": { "summary": string, "bullets": string[], "confidence_pct": number },
  "execution_system": { "summary": string, "bullets": string[], "confidence_pct": number },
  "self_deception_architecture": { "summary": string, "bullets": string[], "confidence_pct": number },
  "blind_spot_architecture": {
    "summary": string,
    "items": [{ "pattern": string, "evidence": string, "likely_cost": string, "confidence_pct": number, "evidence_count": number, "counter_evidence": string[] }]
  },
  "radar_scores": {
    "reality_processing": number,
    "decision_architecture": number,
    "identity_architecture": number,
    "threat_architecture": number,
    "social_operating_system": number,
    "execution_system": number,
    "self_deception_architecture": number
  },
  "memory_seeds": [
    { "memory_type": "theme"|"fear"|"goal"|"contradiction"|"behavioral_pattern"|"emotional_state"|"recurring_phrase"|"motivation"|"identity"|"trigger", "content": string, "evidence": string }
  ]
}`;

export const ANALYSIS_JSON_SCHEMA_PART1 = `{
  "core_diagnosis": string,
  "summary": string,
  "hierarchy": {
    "core_drivers": [{ "rank": number, "label": string, "score_pct": number, "explanation": string, "evidence": string[], "confidence": "weak"|"moderate"|"strong", "confidence_pct": number }],
    "core_threats": [{ "rank": number, "label": string, "score_pct": number, "explanation": string, "evidence": string[], "confidence": "weak"|"moderate"|"strong", "confidence_pct": number }],
    "core_constraints": [{ "rank": number, "label": string, "score_pct": number, "explanation": string, "evidence": string[], "confidence": "weak"|"moderate"|"strong", "confidence_pct": number }]
  },
  "perception_calibration": {
    "accuracy_pct": number,
    "bias_level": "low"|"moderate"|"high",
    "quadrant": "elite"|"pattern_seer"|"misses_manipulation"|"paranoid_interpreter",
    "summary": string
  },
  "reality_processing_score": { "correct": number, "total": number, "accuracy_pct": number, "summary": string },
  "archetypes": {
    "primary": { "name": string, "score_pct": number, "core_drive": string, "weapon": string, "blind_spot": string },
    "secondary": { "name": string, "score_pct": number, "core_drive": string, "weapon": string, "blind_spot": string },
    "shadow": { "name": string, "score_pct": number, "core_drive": string, "weapon": string, "blind_spot": string }
  },
  "reality_processing": { "summary": string, "bullets": string[], "confidence_pct": number },
  "decision_architecture": { "summary": string, "bullets": string[], "confidence_pct": number },
  "identity_architecture": { "summary": string, "bullets": string[], "confidence_pct": number },
  "threat_architecture": { "summary": string, "bullets": string[], "confidence_pct": number },
  "social_operating_system": { "summary": string, "bullets": string[], "confidence_pct": number },
  "execution_system": { "summary": string, "bullets": string[], "confidence_pct": number },
  "self_deception_architecture": { "summary": string, "bullets": string[], "confidence_pct": number },
  "radar_scores": {
    "reality_processing": number,
    "decision_architecture": number,
    "identity_architecture": number,
    "threat_architecture": number,
    "social_operating_system": number,
    "execution_system": number,
    "self_deception_architecture": number
  }
}`;

export const ANALYSIS_JSON_SCHEMA_PART2 = `{
  "evidence_chains": [{
    "claim": string,
    "chain": [{ "question_id": string, "signal": string }],
    "inference": string,
    "confidence_pct": number,
    "evidence_count": number,
    "counter_evidence": string[],
    "counter_evidence_count": number
  }],
  "mechanism_map": [{ "driver": string, "threat": string, "coping_strategy": string, "behavior": string }],
  "root_causes": [{ "rank": number, "mechanism": string, "explains": string[], "coverage_pct": number, "confidence_pct": number, "evidence": string[] }],
  "self_deception_detector": [{ "claim": string, "evidence_for": string[], "evidence_against": string[], "inference": string, "confidence_pct": number }],
  "behavioral_predictions": [{ "situation": string, "prediction": string, "mechanism": string, "confidence_pct": number }],
  "strategic_adaptations": string[],
  "blind_spot_architecture": {
    "summary": string,
    "items": [{ "pattern": string, "evidence": string, "likely_cost": string, "confidence_pct": number, "evidence_count": number, "counter_evidence": string[] }]
  },
  "memory_seeds": [
    { "memory_type": "theme"|"fear"|"goal"|"contradiction"|"behavioral_pattern"|"emotional_state"|"recurring_phrase"|"motivation"|"identity"|"trigger", "content": string, "evidence": string }
  ]
}`;

const SYSTEM_CORE = `You are Reflecho Analysis Engine V2.

NOT a personality test. Reverse-engineer the user's operating system — incentives, decisions, execution, self-protection.

User should feel: "This understands how I actually work."

FORBIDDEN: Myers-Briggs tone, therapy language, fake archetypes, trait labels without mechanisms, conclusions without Q-id evidence.

HIERARCHY: Rank top 3 core_drivers, core_threats, core_constraints (0–100) with explanation, evidence Q-ids, confidence_pct.

ARCHETYPES (framework only): Strategist, Builder, Sovereign, Operator, Scholar, Commander, Architect, Catalyst, Connector, Competitor — primary/secondary/shadow with score_pct, core_drive, weapon, blind_spot.

PERCEPTION CALIBRATION: Use Section 1 score + bias hint. Quadrants: elite, pattern_seer, misses_manipulation, paranoid_interpreter.

Every major claim needs Q-id evidence. Strong claims need 3+ independent signals.

${OUTPUT_LIMITS}

Return ONLY valid JSON. No markdown.`;

export const ANALYSIS_SYSTEM_PROMPT = `${SYSTEM_CORE}

JSON SCHEMA (return exactly this shape):
${ANALYSIS_JSON_SCHEMA}

Set reality_processing_score and perception_calibration.accuracy_pct from the REALITY PROCESSING block in the user message. Write core_diagnosis last — one causal sentence synthesizing the system.`;

export const ANALYSIS_SYSTEM_PROMPT_PART1 = `${SYSTEM_CORE}

PHASE 1 — core structure only. Do NOT include evidence_chains, mechanism_map, root_causes, self_deception_detector, behavioral_predictions, strategic_adaptations, blind_spot_architecture, or memory_seeds.

JSON SCHEMA:
${ANALYSIS_JSON_SCHEMA_PART1}`;

export const ANALYSIS_SYSTEM_PROMPT_PART2 = `${SYSTEM_CORE}

PHASE 2 — extend the partial dossier from the user message. Stay consistent with hierarchy, archetypes, and core_diagnosis already assigned. Add audit-ready depth.

JSON SCHEMA (merge with partial):
${ANALYSIS_JSON_SCHEMA_PART2}`;

function formatAnswer(r: { answer_choices?: string[] | null }) {
  return r.answer_choices?.[0] ?? "(no answer)";
}

function formatResponses(input: AnalysisPromptInput) {
  const grouped: Record<string, string[]> = {};
  for (const r of input.responses) {
    const dims = r.measured_dimensions?.join(", ") ?? "";
    const line = `- ${r.question_id}${dims ? ` [${dims}]` : ""}\n  Q: ${r.question}\n  A: ${formatAnswer(r)}`;
    (grouped[r.category] ??= []).push(line);
  }

  return CATEGORIES.map((c) => {
    const block = grouped[c];
    if (!block) return null;
    return `## ${c}\n${block.join("\n")}`;
  })
    .filter(Boolean)
    .join("\n\n");
}

function realityBlock(input: AnalysisPromptInput) {
  const rpLines = input.realityProcessing.by_question
    .map(
      (q) =>
        `${q.id}: ${q.correct ? "strong" : "miss"} → "${q.chosen || "—"}"`,
    )
    .join("\n");

  return `REALITY PROCESSING (Section 1)
Score: ${input.realityProcessing.correct}/${input.realityProcessing.total} (${input.realityProcessing.accuracy_pct}%)
Bias hint: ${input.perceptionBias.bias_level} (${input.perceptionBias.cynical_wrong_pct}% cynical wrong picks)
Quadrant hint: ${input.perceptionBias.suggested_quadrant_hint}
${rpLines}`;
}

function subjectBlock(input: AnalysisPromptInput) {
  return `SUBJECT: ${input.displayName} | Age: ${input.ageRange ?? "—"} | Role: ${input.occupation ?? "—"}
${TOTAL_QUESTIONS} answers below. Triangulate across ALL sections.`;
}

export function computePerceptionBias(score: RealityProcessingScore) {
  const cynicalRe =
    /lying|lied|Liar|dishonest|hypocrit|Manipul|They lied|values are fake|incompetent|hidden motives|hypocrites|unintelligent|Bad manager|Good manager|weak\./i;
  let cynicalWrong = 0;
  let wrong = 0;
  for (const b of score.by_question) {
    if (b.correct) continue;
    wrong++;
    if (cynicalRe.test(b.chosen)) cynicalWrong++;
  }
  const cynical_wrong_pct = wrong ? Math.round((cynicalWrong / wrong) * 100) : 0;
  const bias_level: "low" | "moderate" | "high" =
    cynical_wrong_pct > 60 ? "high" : cynical_wrong_pct > 30 ? "moderate" : "low";

  const acc = score.accuracy_pct;
  let suggested_quadrant_hint: PerceptionQuadrant = "misses_manipulation";
  if (acc >= 70 && bias_level === "low") suggested_quadrant_hint = "elite";
  else if (acc >= 70 && bias_level !== "low")
    suggested_quadrant_hint = "pattern_seer";
  else if (acc < 55 && bias_level === "high")
    suggested_quadrant_hint = "paranoid_interpreter";

  return { bias_level, cynical_wrong_pct, suggested_quadrant_hint };
}

export function buildAnalysisUserPrompt(input: AnalysisPromptInput) {
  return `${subjectBlock(input)}

${realityBlock(input)}

ASSESSMENT RESPONSES

${formatResponses(input)}`;
}

export function buildAnalysisUserPromptPart1(input: AnalysisPromptInput) {
  return `${subjectBlock(input)}

${realityBlock(input)}

PHASE 1 ORDER: hierarchy → archetypes → perception_calibration → dimension summaries → radar_scores → core_diagnosis (one sentence, last).

ASSESSMENT RESPONSES

${formatResponses(input)}`;
}

export function buildAnalysisUserPromptPart2(
  input: AnalysisPromptInput,
  partial: Record<string, unknown> | CognitiveDossier,
) {
  return `${subjectBlock(input)}

${realityBlock(input)}

PARTIAL DOSSIER (already locked — stay consistent)
${JSON.stringify(partial)}

PHASE 2 ORDER: evidence_chains → root_causes → mechanism_map → self_deception_detector → behavioral_predictions → blind_spot_architecture → memory_seeds.

ASSESSMENT RESPONSES

${formatResponses(input)}`;
}
