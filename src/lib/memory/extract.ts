import { getOpenAI, DEFAULT_MODEL, temperatureParam } from "@/lib/ai/openai";
import { MEMORY_EXTRACTION_SYSTEM } from "@/lib/ai/mirror-prompt";

export interface ExtractedMemory {
  memory_type: string;
  content: string;
  evidence: string;
}

export async function extractMemoriesFromExchange(
  exchange: { role: "user" | "assistant"; content: string }[],
): Promise<ExtractedMemory[]> {
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
        { role: "system", content: MEMORY_EXTRACTION_SYSTEM },
        { role: "user", content: transcript },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as { memories?: ExtractedMemory[] };
    return Array.isArray(parsed.memories) ? parsed.memories : [];
  } catch (e) {
    console.error("memory extraction failed", e);
    return [];
  }
}
