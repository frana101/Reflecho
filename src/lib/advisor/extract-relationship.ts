import { getOpenAI, DEFAULT_MODEL, temperatureParam } from "@/lib/ai/openai";
import type { RelationshipExtraction } from "@/lib/advisor/types";

const EXTRACTION_SYSTEM = `You are Reflechto's relationship memory module.

After each advisor exchange, extract durable facts the advisor must remember later.

Return ONLY JSON:
{
  "items": [
    {
      "memory_type": "theme"|"fear"|"goal"|"contradiction"|"behavioral_pattern"|"emotional_state"|"recurring_phrase"|"motivation"|"identity"|"trigger"|"commitment"|"decision"|"outcome"|"progress"|"shift",
      "content": string,
      "evidence": string
    }
  ]
}

Rules:
- Extract 0–8 items. Be selective but don't skip important specifics.
- Use "commitment" when they say they'll do something.
- Use "decision" when they chose a path.
- Use "outcome" when they report what happened (win, loss, mixed).
- Use "progress" when they improved, broke a pattern, or moved forward.
- Use "shift" when their behaviour or belief clearly changed from before.
- Use behavioral_pattern for recurring tendencies.
- content: plain English, specific, reusable months later.
- evidence: short quote or paraphrase from the exchange.
- No invention. No prose outside JSON.`;

export async function extractRelationshipMemory(
  exchange: { role: "user" | "assistant"; content: string }[],
): Promise<RelationshipExtraction> {
  try {
    const openai = getOpenAI();
    const transcript = exchange
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      ...temperatureParam(DEFAULT_MODEL, 0.2),
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: EXTRACTION_SYSTEM },
        { role: "user", content: transcript },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as RelationshipExtraction;
    return {
      items: Array.isArray(parsed.items) ? parsed.items.slice(0, 8) : [],
    };
  } catch (e) {
    console.error("relationship memory extraction failed", e);
    return { items: [] };
  }
}

const SUMMARY_SYSTEM = `You maintain a running summary of an advisor conversation.

Return ONLY JSON:
{
  "summary": string,
  "open_threads": [string]
}

Rules:
- summary: 3–6 sentences. What was discussed, decisions, emotions, commitments. Plain English.
- open_threads: 0–4 unresolved items the advisor should follow up on later (specific).
- Merge with the previous summary — don't lose important history.
- No markdown.`;

export async function summarizeConversation(input: {
  previousSummary: string;
  previousThreads: string[];
  transcript: { role: string; content: string }[];
}): Promise<{ summary: string; open_threads: string[] }> {
  try {
    const openai = getOpenAI();
    const body = [
      input.previousSummary
        ? `PREVIOUS SUMMARY:\n${input.previousSummary}`
        : "PREVIOUS SUMMARY: (none)",
      input.previousThreads.length
        ? `OPEN THREADS:\n${input.previousThreads.join("\n")}`
        : "OPEN THREADS: (none)",
      "RECENT MESSAGES:",
      ...input.transcript.map((m) => `${m.role.toUpperCase()}: ${m.content}`),
    ].join("\n\n");

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      ...temperatureParam(DEFAULT_MODEL, 0.25),
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SUMMARY_SYSTEM },
        { role: "user", content: body },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as {
      summary?: string;
      open_threads?: string[];
    };
    return {
      summary: parsed.summary?.trim() ?? input.previousSummary,
      open_threads: Array.isArray(parsed.open_threads)
        ? parsed.open_threads.slice(0, 4)
        : input.previousThreads,
    };
  } catch (e) {
    console.error("conversation summary failed", e);
    return {
      summary: input.previousSummary,
      open_threads: input.previousThreads,
    };
  }
}

const EVOLUTION_SYSTEM = `You maintain Reflechto's evolving model of a user — built from their dossier, conversations, and memory.

This is NOT shown to the user directly. It powers sharper advice over time.

Return ONLY JSON:
{
  "evolving_summary": string,
  "shift_notes": string,
  "progress_notes": string
}

Rules:
- evolving_summary: 4–8 sentences. How they operate NOW — updated with everything new. Plain English. Specific.
- shift_notes: 1–3 sentences on what CHANGED recently vs before (behaviour, beliefs, patterns). Empty string if nothing shifted.
- progress_notes: 1–3 sentences on wins, movement forward, or patterns they broke. Empty string if none.
- Reference concrete facts from conversations and memory — not generic traits.
- No jargon. No markdown.`;

export async function evolveAdvisorModel(input: {
  dossierBlock: string;
  previousEvolution: {
    evolving_summary: string;
    shift_notes: string;
    progress_notes: string;
  } | null;
  conversationSummaries: string[];
  memoryLines: string[];
  latestExchange: string;
}): Promise<{
  evolving_summary: string;
  shift_notes: string;
  progress_notes: string;
}> {
  try {
    const openai = getOpenAI();
    const userContent = [
      input.dossierBlock,
      input.previousEvolution
        ? `PREVIOUS EVOLVING MODEL:\n${input.previousEvolution.evolving_summary}\n\nPREVIOUS SHIFTS:\n${input.previousEvolution.shift_notes}\n\nPREVIOUS PROGRESS:\n${input.previousEvolution.progress_notes}`
        : "PREVIOUS EVOLVING MODEL: (none — build from dossier + new data)",
      input.conversationSummaries.length
        ? `PAST CONVERSATION SUMMARIES:\n${input.conversationSummaries.join("\n---\n")}`
        : "",
      input.memoryLines.length
        ? `STORED MEMORY:\n${input.memoryLines.join("\n")}`
        : "",
      `LATEST EXCHANGE:\n${input.latestExchange}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      ...temperatureParam(DEFAULT_MODEL, 0.35),
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: EVOLUTION_SYSTEM },
        { role: "user", content: userContent },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as {
      evolving_summary?: string;
      shift_notes?: string;
      progress_notes?: string;
    };
    return {
      evolving_summary: parsed.evolving_summary?.trim() ?? "",
      shift_notes: parsed.shift_notes?.trim() ?? "",
      progress_notes: parsed.progress_notes?.trim() ?? "",
    };
  } catch (e) {
    console.error("advisor evolution failed", e);
    return {
      evolving_summary: input.previousEvolution?.evolving_summary ?? "",
      shift_notes: "",
      progress_notes: "",
    };
  }
}
