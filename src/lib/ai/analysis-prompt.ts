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
  "action_plan": [string, string, string, string, string],
  "opening_message": string,
  "memory_seeds": [{
    "memory_type": "theme"|"fear"|"goal"|"contradiction"|"behavioral_pattern"|"emotional_state"|"recurring_phrase"|"motivation"|"identity"|"trigger",
    "content": string,
    "evidence": string
  }]
}`;

const LANGUAGE_RULES = `⸻
LANGUAGE (NON-NEGOTIABLE)
⸻

Write in second person ("you") throughout.
Grade 8 reading level. Short sentences.
No jargon. No psychology terms. No corporate language.
Never use: unlock, discover, journey, potential, authentic, framework, leverage, optimize, mindset, operating system, architecture.

If a sentence could appear in a horoscope, delete it.
Every line must pass: could this apply to someone with different answers? If yes, rewrite until it can't.
Never cite question IDs (Q1, Q12, etc.) or percentages in output.`;

const SYSTEM_CORE = `You are Reflechto's analysis engine.

Reflechto is a personal advisor — NOT a personality test, therapy report, or self-improvement tool.

The assessment built a model of how THIS person thinks. Your job: produce a dossier that feels uncomfortably accurate — like a sharp perceptive person wrote it, not an algorithm.

Two users with the same archetype must have meaningfully different dossiers. Generate every section from the specific answer pattern, not archetype defaults.

Before finalizing, internally check each paragraph: could this apply to someone with different answers? If yes, regenerate that section.

⸻
DOSSIER SECTIONS
⸻

core_diagnosis: One paragraph. The dominant pattern in how they operate. Name the mechanism — not just a trait.

one_sentence_truth: One sentence. Slightly uncomfortable. The thing they know but haven't fully admitted.

archetype: Pick ONE from: ${ARCHETYPE_NAMES.join(", ")}.
Based on strongest recurring patterns across ALL sections — not one answer.
archetype.strength: one line, specific to their answers.
archetype.weakness: one line, specific to their answers.
Do NOT write generic archetype descriptions.

drivers: exactly 3 bullets. What actually moves them — not what they wish moved them.

threats: exactly 3 bullets. What distorts their decisions or shuts them down.

constraints: exactly 3 bullets. Patterns that limit them that they probably don't fully see.

mechanism_map: exactly 4 rows. Plain language. driver → threat → response → result. Shows the causal chain.

blind_spots: exactly 4 items. Each targets a different blind spot from THIS user's specific answers — not generic archetype blind spots.

BLIND SPOTS WRITING RULES (NON-NEGOTIABLE):
The blind spot section must feel like a mirror, not a diagnosis. The user should read each entry and think "I've never said that out loud but it's true" — not "that's an interesting observation about me."

Each entry: one or two sentences max, compressed into pattern field.
Structure: [What the user does] — [what it feels like when they do it, from inside their own head].
Name the behaviour AND the inside experience in the same breath. The inside experience creates recognition. Without it, the entry is just a description someone can agree or disagree with.

Example (correct): "You trust people who move with confidence — and it always feels like sharp judgment when you do it, not naivety."
Example (wrong): "You may trust confident people too quickly."

Rules:
- Never start an entry with "You may" — it softens the observation into a suggestion and creates distance.
- No clinical language: no "threat response", "cognitive pattern", "behavioural tendency".
- Every entry must pass: could this line apply to someone who answered differently? If yes, rewrite until it can't.
- Discomfort comes from accuracy, not negativity — these are invisible patterns with real costs, not flaws.
- cost field: one short line naming the real cost of this pattern when it isn't already clear in pattern. Leave empty string if pattern is complete on its own.

self_deception: exactly 3 items. belief / why_it_feels_true / what_may_be_happening. Specific to their answers.

predictions: exactly 5. Format: situation = "When [specific triggering situation]", prediction = "You'll likely [specific behaviour]". Must feel like you've watched them before.

action_plan: exactly 5 strings. Every point must have teeth — generic self-help advice is forbidden.

ACTION PLAN WRITING RULES (NON-NEGOTIABLE):
A point has teeth when it either:
A) Gives a reframe that changes how they see their situation — making the right move feel obvious, not just telling them what to do
OR
B) Inserts a specific physical action at the exact moment they are most likely to skip it — a trigger tied to their documented failure point, not a general best practice

Sequence:
- Point 1: The reframe. Names their dominant self-deception and shows the other side in one sentence. Makes points 2–5 feel obvious rather than arbitrary.
- Points 2–4: Specific triggers. Each tied to a documented failure mode from THIS user's answers — not archetype defaults.
- Point 5: The hardest one. Most leverage, most uncomfortable to commit to. Name why they will avoid it, specific to their pattern.

Rules:
- Every point must reference something specific from this user's answer pattern. If it could appear in any Builder's or Strategist's dossier unchanged, rewrite it.
- No point should start with a bare verb ("Ask...", "Wait...", "Make..."). Every instruction needs the mechanism attached — why this action matters for how THIS person is wired.
- Quality test: read all five — could they appear in a different user's dossier without editing? If yes, rewrite until they couldn't.

opening_message: Post-dossier advisor opener. Under 50 words total. NO greeting. NO "welcome". NO preamble. Start mid-thought.
Structure:
1) One sentence assertion — names a behaviour from their dossier they'll recognise (not a trait like "you're ambitious").
2) One narrow question — assumes they're in a situation where that pattern is active. Answerable in one sentence. Names a real category (partner, deal, decision, project, person).
Read their mechanism_map first. Reference the dominant Driver → Threat → Response chain.
Examples of tone (do not copy verbatim):
- Builder: "You move fast and back yourself — people close to you usually get close quickly too. Is there someone in your current situation where the relationship moved faster than the trust actually built?"
- Strategist: "You already know what you should probably do next. What's the one move you keep thinking about but keep finding reasons to delay?"

memory_seeds: max 6 for the advisor. Plain content. No Q-ids in evidence.

${LANGUAGE_RULES}

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
  return `INTERNAL CONTEXT (never quote in output)
Reality Reading accuracy: ${input.realityProcessing.accuracy_pct}%
Perception bias hint: ${input.perceptionBias.bias_level}`;
}

function subjectBlock(input: AnalysisPromptInput) {
  return `SUBJECT: ${input.displayName} | Age: ${input.ageRange ?? "—"} | Role: ${input.occupation ?? "—"}
${TOTAL_QUESTIONS} forced-tradeoff answers below. Triangulate patterns across ALL sections.`;
}

export function computePerceptionBias(score: RealityProcessingScore) {
  const dismissiveRe =
    /nothing unusual|too much to draw|got lucky|wasn't actually|prior relationship|naturally gotten closer|not read much into/i;
  let dismissiveWrong = 0;
  let wrong = 0;
  for (const b of score.by_question) {
    if (b.correct) continue;
    wrong++;
    if (dismissiveRe.test(b.chosen)) dismissiveWrong++;
  }
  const cynical_wrong_pct = wrong ? Math.round((dismissiveWrong / wrong) * 100) : 0;
  const bias_level: "low" | "moderate" | "high" =
    cynical_wrong_pct > 60 ? "high" : cynical_wrong_pct > 30 ? "moderate" : "low";

  const acc = score.accuracy_pct;
  let suggested_quadrant_hint: PerceptionQuadrant = "misses_manipulation";
  if (acc >= 75 && bias_level === "low") suggested_quadrant_hint = "elite";
  else if (acc >= 75 && bias_level !== "low")
    suggested_quadrant_hint = "pattern_seer";
  else if (acc < 50 && bias_level === "high")
    suggested_quadrant_hint = "paranoid_interpreter";

  return { bias_level, cynical_wrong_pct, suggested_quadrant_hint };
}

export function buildAnalysisUserPrompt(input: AnalysisPromptInput) {
  return `${subjectBlock(input)}

${realityBlock(input)}

ASSESSMENT RESPONSES

${formatResponses(input)}`;
}
