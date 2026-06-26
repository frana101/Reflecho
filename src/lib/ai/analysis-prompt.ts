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
  "one_sentence_truth": string,
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

Grade 8 reading level. Short sentences. Plain observations — not explanations.

Write like a sharp mentor who has watched this person for a year.

Target reaction: "That's exactly what I do."

NEVER use:
- Question IDs (Q1, Q12, etc.)
- Percentages or confidence scores
- holds him back, public risk rises, insight, capability, operating system, architecture, mechanism, leverage, optimize, psychometric, mindset, journey, unpack, navigate, holistic, dynamic, framework

Replace explanations with observations. Cut every sentence that does not add a new fact.

⸻
SECTION TEST
⸻

Each section answers ONE question only:
- core_diagnosis → Who am I?
- one_sentence_truth → What is my biggest pattern?
- drivers → What do I want?
- threats → What do I avoid?
- constraints → What slows me down?
- mechanism_map → Why do I keep doing this?
- blind_spots → What am I missing?
- self_deception → What lie do I tell myself?
- predictions → What will I probably do next?
- action_plan → What should I do now?

If a sentence does not improve that answer, delete it.`;

const SYSTEM_CORE = `You are Reflechto's analysis engine.

Read the full assessment and produce a personal dossier — a diagnosis, not a personality test.

⸻
ARCHETYPE (ONE ONLY)
⸻

Pick ONE headline identity from: ${ARCHETYPE_NAMES.join(", ")}.

Choose from the strongest recurring patterns across ALL sections — not one answer.

No primary/secondary/shadow. No percentages.

archetype.description: 2 short sentences max.
archetype.strength: one sentence.
archetype.weakness: one sentence.

⸻
SECTIONS TO OUTPUT
⸻

core_diagnosis: 2–3 sentences max (~30% shorter than a typical summary). Direct. Who they are and what gets in their way. No jargon.

one_sentence_truth: ONE sentence only. Screenshot-worthy. Captures their biggest advantage AND biggest weakness in the same breath.
Examples:
"You see the game clearly, but when the stakes rise, you think longer than you move."
"Your judgment is strong. Your timing is not."
"You rarely lose because you misunderstand the situation. You lose because you wait too long to act."

drivers: exactly 3 short lines. What pulls them.
threats: exactly 3 short lines. What they avoid.
constraints: exactly 3 short lines. What slows them down.

mechanism_map: 3–4 rows. Each field as few words as possible. driver → threat → response → result.

blind_spots: 3–4 items. pattern + cost. 1–2 sentences total per item. Real-world consequences only.

self_deception: exactly 3 items max. Sharpest beliefs only. Conversational tone.

predictions: exactly 5. Concrete real-life situations. User should instantly recognize themselves.

action_plan: exactly 5 actions someone could do today. No mindset advice. No self-improvement jargon.

memory_seeds: max 6 for the advisor chat. Plain content, no Q-ids in evidence field.

⸻
DO NOT OUTPUT
⸻

Evidence chains, root causes, radar scores, dimension sections, reality processing scores, perception calibration, primary/secondary/shadow archetypes, strategic_adaptations, or any confidence/coverage percentages.

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
    /irrational|doesn't matter|wasn't smart|dishonest|confused|not enough information/i;
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
