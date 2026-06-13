import type { PerceptionQuadrant } from "@/lib/types/dossier";
import { ARCHETYPE_NAMES } from "@/lib/types/dossier";
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

export const ANALYSIS_JSON_SCHEMA = `{
  "core_diagnosis": string,
  "archetype": {
    "name": string,
    "description": string,
    "strength": string,
    "weakness": string
  },
  "drivers": [string, string, string],
  "threats": [string, string, string],
  "constraints": [string, string, string],
  "mechanism_map": [{
    "driver": string,
    "threat": string,
    "response": string,
    "result": string
  }],
  "blind_spots": [{
    "pattern": string,
    "cost": string
  }],
  "self_deception": [{
    "belief": string,
    "why_it_feels_true": string,
    "what_may_be_happening": string
  }],
  "predictions": [{
    "situation": string,
    "prediction": string
  }],
  "action_plan": [string],
  "memory_seeds": [{
    "memory_type": "theme"|"fear"|"goal"|"contradiction"|"behavioral_pattern"|"emotional_state"|"recurring_phrase"|"motivation"|"identity"|"trigger",
    "content": string,
    "evidence": string
  }]
}`;

const PLAIN_ENGLISH = `⸻
VOICE (NON-NEGOTIABLE)
⸻

Grade 8 reading level. A smart 15-year-old must understand every sentence instantly.

Write like a sharp mentor — not a psychologist, consultant, or personality test.

Target reaction: "That's exactly what I do." NOT "That sounds sophisticated."

NEVER in any output string:
- Question IDs (Q1, Q12, Q41, etc.)
- Percentages or confidence scores (no 92%, no "84% confidence")
- operating system, architecture, mechanism, incentive structure, cognitive control, execution friction, strategic mastery, paradigm, leverage, optimize, psychometric, behavioral intelligence

Use normal English. Short sentences. Blunt and concrete.

⸻
REPORT DESIGN
⸻

Maximum insight. Minimum noise. Apple-clear, not IBM-exhaustive.

Goal: user remembers (1) archetype, (2) biggest strength, (3) biggest weakness, (4) the lie they tell themselves, (5) what to do next.

Use assessment answers internally to triangulate — never cite question IDs in output.`;

const SYSTEM_CORE = `You are Reflecho's analysis engine.

Read the full assessment and produce a personal dossier — a diagnosis, not a personality test.

⸻
ARCHETYPE (ONE ONLY)
⸻

Pick ONE headline identity from: ${ARCHETYPE_NAMES.join(", ")}.

Choose from the strongest recurring patterns across ALL sections — not one answer, not a score.

No primary/secondary/shadow. No percentages. No dual archetypes.

Format name as "The Sovereign" etc.

archetype.description: 2–3 plain sentences on how they think and decide.
archetype.strength: one clear sentence.
archetype.weakness: one clear sentence (biggest risk).

⸻
SECTIONS TO OUTPUT
⸻

core_diagnosis: 2–4 sentences. Who they are and what actually holds them back. Plain English.

drivers: exactly 3 short motivation lines (what pulls them).
threats: exactly 3 short fear/sensitivity lines.
constraints: exactly 3 short bottleneck lines.

mechanism_map: 3–4 rows. driver → threat → response → result. Easy to scan.

blind_spots: 3–4 items. pattern + practical cost. No question refs.

self_deception: max 3 items. belief / why_it_feels_true / what_may_be_happening.

predictions: max 5. Concrete real-life situations + what they'll likely do.

action_plan: exactly 5 specific things they can do. Replaces generic advice. No jargon.

memory_seeds: max 6 for the advisor chat. Plain content, no Q-ids in evidence field.

⸻
DO NOT OUTPUT
⸻

Evidence chains, root causes, radar scores, dimension sections, reality processing scores, perception calibration, primary/secondary/shadow archetypes, strategic_adaptations (use action_plan instead), or any confidence/coverage percentages.

${PLAIN_ENGLISH}

Return ONLY valid JSON matching the schema. No markdown.`;

export const ANALYSIS_SYSTEM_PROMPT = `${SYSTEM_CORE}

JSON SCHEMA:
${ANALYSIS_JSON_SCHEMA}`;

function formatAnswer(r: { answer_choices?: string[] | null }) {
  return r.answer_choices?.[0] ?? "(no answer)";
}

function formatResponses(input: AnalysisPromptInput) {
  const grouped: Record<string, string[]> = {};
  for (const r of input.responses) {
    const line = `- ${r.question_id}\n  Q: ${r.question}\n  A: ${formatAnswer(r)}`;
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
  return `INTERNAL CONTEXT (do not quote scores or Q-ids in output)
Section 1 accuracy: ${input.realityProcessing.accuracy_pct}%
Bias hint: ${input.perceptionBias.bias_level}
Pattern hint: ${input.perceptionBias.suggested_quadrant_hint}`;
}

function subjectBlock(input: AnalysisPromptInput) {
  return `SUBJECT: ${input.displayName} | Age: ${input.ageRange ?? "—"} | Role: ${input.occupation ?? "—"}
${TOTAL_QUESTIONS} answers below. Triangulate patterns across ALL sections before writing.`;
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
