import type { CognitiveDossier } from "@/lib/types/dossier";
import type { AdvisorRelationshipContext } from "@/lib/advisor/types";
import {
  computeAdvisorDepth,
  depthInstructions,
} from "@/lib/advisor/depth";

interface MemoryRow {
  memory_type: string;
  content: string;
  evidence?: string | null;
  observation_count?: number;
  last_observed_at?: string | null;
}

interface BuildArgs {
  displayName: string;
  dossier?: Partial<CognitiveDossier> | null;
  relationshipContext: AdvisorRelationshipContext;
}

export const ADVISOR_SYSTEM_PROMPT_BASE = `You are Reflechto — this user's personal advisor in an ongoing relationship.

You are NOT a therapist, life coach, personality test, or generic chatbot.
You ARE someone who has been paying attention — across weeks and months.

⸻
RELATIONSHIP BEHAVIOUR (CRITICAL)
⸻

You remember. You track change. You notice when something shifted.

- Reference past conversations, commitments, and outcomes by name — not vaguely.
- When they report progress, name it directly.
- When behaviour repeats, say so: "Same pattern as before — different details."
- When something shifted, call it out using shift notes or memory.
- Follow up on open threads from past sessions when relevant.
- Never pretend this is the first time you've spoken.

⸻
HOW YOU SPEAK
⸻

Casual but not sloppy. Direct but not cold. Honest but not brutal for its own sake.
Short paragraphs — max 3 sentences each.
No bullet points unless genuinely needed.
No filler openers. Never start with "I".
Under 250 words unless the decision requires more.

⸻
INTERNAL PROCESS (before every response)
⸻

1. What are they actually feeling underneath the question?
2. Which dossier pattern + stored memory + past conversation explains this?
3. What changed since you last talked to them?
4. Root cause + one concrete next move.

⸻
RESPONSE SHAPE
⸻

1. Acknowledge emotion — one sentence.
2. Connect to their documented pattern OR a specific past conversation/commitment.
3. Root cause.
4. Advice that only fits them.
5. One next move — or follow-up on an open thread they left hanging.`;

export function buildAdvisorSystemPrompt({
  displayName,
  dossier,
  relationshipContext,
}: BuildArgs) {
  const { stats, evolution, conversationSummaries, crossSessionSnippets, memories } =
    relationshipContext;
  const depth = computeAdvisorDepth(stats);

  const crossConversation =
    stats.conversationCount >= 3
      ? `\nCROSS-SESSION MODE: ${stats.conversationCount} sessions on record. You MUST reference specific past conversations, commitments, or outcomes when relevant — not just the dossier.`
      : "";

  const dossierBlock = dossier
    ? `
ASSESSMENT BASELINE (starting point — supplement with everything learned since)
- Core diagnosis: ${dossier.core_diagnosis ?? "(none)"}
- One sentence truth: ${dossier.one_sentence_truth ?? "(none)"}
- Archetype: ${dossier.archetype?.name ?? "(none)"}
- Strength: ${dossier.archetype?.strength ?? ""}
- Weakness: ${dossier.archetype?.weakness ?? ""}
- Drivers: ${dossier.drivers?.join(" | ") ?? "(none)"}
- Threats: ${dossier.threats?.join(" | ") ?? "(none)"}
- Constraints: ${dossier.constraints?.join(" | ") ?? "(none)"}
- Mechanism map: ${dossier.mechanism_map?.map((m) => `${m.driver} → ${m.result}`).join(" || ") ?? "(none)"}
- Blind spots: ${dossier.blind_spots?.map((b) => b.pattern).join(" | ") ?? "(none)"}
- Self-deception: ${dossier.self_deception?.map((s) => s.belief).join(" | ") ?? "(none)"}
`
    : `
ASSESSMENT BASELINE: not yet built.`;

  const evolutionBlock = evolution?.evolving_summary
    ? `
EVOLVING MODEL (how they operate NOW — trust this over the baseline when they conflict)
${evolution.evolving_summary}
${evolution.shift_notes ? `\nRECENT SHIFTS (call these out when relevant):\n${evolution.shift_notes}` : ""}
${evolution.progress_notes ? `\nRECENT PROGRESS (acknowledge when relevant):\n${evolution.progress_notes}` : ""}`
    : "";

  const memoryBlock = memories.length
    ? `
STORED MEMORY (commitments, decisions, outcomes, patterns — cite specifically):
${memories
  .map(
    (m) =>
      `- [${m.memory_type}] ${m.content}${m.evidence ? ` — "${m.evidence}"` : ""}${m.observation_count && m.observation_count > 1 ? ` (seen ${m.observation_count}x)` : ""}`,
  )
  .join("\n")}`
    : "";

  const currentThreads =
    relationshipContext.currentConversationSummary?.open_threads?.length
      ? `\nOPEN THREADS THIS SESSION:\n${relationshipContext.currentConversationSummary.open_threads.map((t) => `- ${t}`).join("\n")}`
      : "";

  const pastSummariesBlock = conversationSummaries.length
    ? `
PAST CONVERSATIONS (summaries — reference by topic when relevant):
${conversationSummaries
  .map(
    (s, i) =>
      `[${i + 1}] (${new Date(s.updated_at).toLocaleDateString()}, ${s.message_count} msgs) ${s.summary}${s.open_threads?.length ? `\n    Open: ${s.open_threads.join("; ")}` : ""}`,
  )
  .join("\n")}`
    : "";

  const snippetsBlock = crossSessionSnippets.length
    ? `
RECENT LINES FROM OTHER SESSIONS (exact wording — use for continuity):
${crossSessionSnippets
  .map((s) => {
    const title = s.title ?? "Untitled";
    const lines = s.lines
      .map((l) => `  ${l.role}: ${l.content}`)
      .join("\n");
    return `[${new Date(s.updated_at).toLocaleDateString()}] ${title}\n${lines}`;
  })
  .join("\n\n")}`
    : "";

  const relationshipBlock = `
RELATIONSHIP DEPTH
- Sessions: ${stats.conversationCount} | Messages: ${stats.messageCount} | Memory items: ${stats.memoryCount}
- Tier: ${depth}
${depthInstructions(depth)}${crossConversation}${currentThreads}`;

  return `${ADVISOR_SYSTEM_PROMPT_BASE}

USER: ${displayName}
${relationshipBlock}
${dossierBlock}
${evolutionBlock}
${memoryBlock}
${pastSummariesBlock}
${snippetsBlock}`;
}

/** @deprecated */
export const buildMirrorSystemPrompt = buildAdvisorSystemPrompt;
export const MIRROR_SYSTEM_PROMPT_BASE = ADVISOR_SYSTEM_PROMPT_BASE;

/** @deprecated use extractRelationshipMemory */
export const MEMORY_EXTRACTION_SYSTEM = `legacy`;
