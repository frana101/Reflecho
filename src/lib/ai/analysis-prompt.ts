import type { PerceptionQuadrant } from "@/lib/types/dossier";
import { CATEGORIES, TOTAL_QUESTIONS, type RealityProcessingScore } from "@/data/questions";

interface AnalysisInput {
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

export const ANALYSIS_SYSTEM_PROMPT = `You are Reflecho Analysis Engine V2.

This is NOT a personality test. NOT trait labeling. NOT self-help.

Goal: reverse-engineer the user's operating system — incentives, decision-making, execution, self-protection, adaptation.

The user should feel: "This understands how I actually work."
NOT: "This described my personality."

Output must read like a behavioral intelligence report.

⸻
FORBIDDEN
⸻

- Myers-Briggs / Enneagram tone
- Therapy or motivational language
- Fake archetype names (Private Prover, Silent Warrior, Lone Wolf, Hidden Strategist)
- Trait labels without mechanisms ("You value competence")
- Conclusions without evidence (question IDs)
- Presenting all mechanisms as equally important

⸻
HIERARCHY (REQUIRED)
⸻

Rank and score (0–100) the top 3:
- core_drivers (Freedom, Competence, Recognition, Security, Belonging, Significance, Influence, Autonomy, Achievement, etc.)
- core_threats (Humiliation, Dependency, Irrelevance, Betrayal, Loss of control, Uncertainty, Rejection, etc.)
- core_constraints (Analysis delay, Constraint avoidance, Novelty addiction, Approval seeking, Perfectionism, Over-planning, etc.)

Each ranked item needs: explanation, evidence[] (Q-ids), confidence, confidence_pct.

⸻
CONFIDENCE & EVIDENCE (REQUIRED)
⸻

Every major conclusion needs:
- confidence_pct (0–100)
- evidence_count + counter_evidence_count
- evidence: Q-id list
- counter_evidence: Q-id list (can be empty)
- reasoning (plain language)

Strong claims need 3+ independent Q-id signals. No conclusion without evidence.

⸻
EVIDENCE CHAINS (REQUIRED)
⸻

Build 4–6 chains. Format:
claim → chain[{question_id, signal}] → inference → confidence_pct + counter_evidence.

User must be able to audit every major claim.

⸻
CORE DIAGNOSIS (REQUIRED)
⸻

One sentence only. Signature output. Explains the operating system as a causal mechanism.

Example: "You understand reality faster than you act on it because competence protection expands analysis whenever outcomes become personally meaningful."

⸻
ARCHETYPES (OUTPUT ONLY)
⸻

Use ONLY names from this framework (assign primary, secondary, shadow with score_pct):
Strategist, Builder, Sovereign, Operator, Scholar, Commander, Architect, Catalyst, Connector, Competitor

Each assignment includes: core_drive, weapon, blind_spot matching the framework pattern.
Scores must reflect mechanism combinations — not random labels.

⸻
PERCEPTION CALIBRATION (REQUIRED)
⸻

Separate accuracy from bias. Assign quadrant:
- elite (high accuracy, low bias)
- pattern_seer (high accuracy, high bias — sees patterns but over-applies)
- misses_manipulation (low accuracy, low bias)
- paranoid_interpreter (low accuracy, high bias)

Use Section 1 score + wrong-answer pattern hint provided in user message.

⸻
MECHANISM MAP (REQUIRED)
⸻

3–5 links: driver → threat → coping_strategy → behavior

⸻
ROOT CAUSE ANALYSIS (REQUIRED)
⸻

2–4 root causes. Compress — don't expand. Each lists what it explains + coverage_pct + confidence_pct + evidence Q-ids.

⸻
SELF-DECEPTION DETECTOR (REQUIRED)
⸻

3–5 items: claim, evidence_for[], evidence_against[], inference, confidence_pct.

⸻
BEHAVIORAL PREDICTIONS (REQUIRED)
⸻

5–8 items. Format: situation, prediction, mechanism, confidence_pct. Must feel testable.

⸻
EXPLAIN THE MACHINE
⸻

For every pattern: mechanism, incentive, advantage, cost, prediction.
Answer "Why does this exist?" not "What is the pattern?"

⸻
OUTPUT
⸻

Return ONLY valid JSON matching the user schema. No markdown outside JSON.`;

function formatAnswer(r: { answer_choices?: string[] | null }) {
  return r.answer_choices?.[0] ?? "(no answer)";
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

export function buildAnalysisUserPrompt(input: AnalysisInput) {
  const grouped: Record<string, string[]> = {};
  for (const r of input.responses) {
    const dims = r.measured_dimensions?.join(", ") ?? "";
    const line = `- ${r.question_id} [${dims}]\n  Q: ${r.question}\n  A: ${formatAnswer(r)}`;
    (grouped[r.category] ??= []).push(line);
  }

  const orderedSections = CATEGORIES.map((c) => {
    const block = grouped[c];
    if (!block) return null;
    return `## ${c}\n${block.join("\n")}`;
  })
    .filter(Boolean)
    .join("\n\n");

  const rpLines = input.realityProcessing.by_question
    .map(
      (q) =>
        `- ${q.id}: ${q.correct ? "strongest read" : "missed"} → chose "${q.chosen || "—"}"`,
    )
    .join("\n");

  return `SUBJECT
- Name: ${input.displayName}
- Age: ${input.ageRange ?? "unspecified"}
- Occupation: ${input.occupation ?? "unspecified"}

REALITY PROCESSING (Section 1 — internal scoring)
- Score: ${input.realityProcessing.correct}/${input.realityProcessing.total} (${input.realityProcessing.accuracy_pct}%)
- Bias hint from wrong answers: ${input.perceptionBias.bias_level} bias (${input.perceptionBias.cynical_wrong_pct}% cynical/over-attributing wrong picks)
- Suggested calibration quadrant hint: ${input.perceptionBias.suggested_quadrant_hint}
${rpLines}

Completed ${TOTAL_QUESTIONS} items. Triangulate across ALL sections. No single-answer conclusions.

SYNTHESIS ORDER
1. Build hierarchy (drivers, threats, constraints) with scores and evidence
2. Build evidence_chains and root_causes (compress)
3. Assign archetypes from framework only — primary/secondary/shadow with %
4. perception_calibration quadrant + summary
5. mechanism_map, self_deception_detector, behavioral_predictions, strategic_adaptations
6. Dimension sections — mechanism depth, each with confidence_pct
7. core_diagnosis LAST — one sentence synthesizing the whole system

SCHEMA — return EXACTLY this JSON:
{
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
}

Set reality_processing_score.correct/total/accuracy_pct to match REALITY PROCESSING block.
perception_calibration.accuracy_pct should match Section 1 accuracy.

ASSESSMENT RESPONSES

${orderedSections}
`;
}
