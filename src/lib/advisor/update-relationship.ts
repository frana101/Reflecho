import type { SupabaseClient } from "@supabase/supabase-js";
import type { CognitiveDossier } from "@/lib/types/dossier";
import {
  evolveAdvisorModel,
  extractRelationshipMemory,
  summarizeConversation,
} from "@/lib/advisor/extract-relationship";
import { persistExtractedMemories } from "@/lib/memory/persist";

function dossierBlock(d: CognitiveDossier) {
  return `DOSSIER BASELINE
Archetype: ${d.archetype.name}
One sentence truth: ${d.one_sentence_truth}
Core diagnosis: ${d.core_diagnosis}
Drivers: ${d.drivers.join(" | ")}
Threats: ${d.threats.join(" | ")}
Constraints: ${d.constraints.join(" | ")}`;
}

export async function initializeAdvisorEvolution(
  supabase: SupabaseClient,
  userId: string,
  dossier: CognitiveDossier,
) {
  const summary = [
    dossier.core_diagnosis,
    dossier.one_sentence_truth,
    `Archetype: ${dossier.archetype.name}. Strength: ${dossier.archetype.strength}. Weakness: ${dossier.archetype.weakness}.`,
    `Key patterns from assessment — drivers: ${dossier.drivers.slice(0, 2).join("; ")}. Threats: ${dossier.threats.slice(0, 2).join("; ")}.`,
  ].join(" ");

  await supabase.from("advisor_evolution").upsert({
    user_id: userId,
    evolving_summary: summary,
    shift_notes: "",
    progress_notes: "",
    version: 1,
    updated_at: new Date().toISOString(),
  });
}

export async function clearAdvisorRelationshipData(
  supabase: SupabaseClient,
  userId: string,
) {
  await supabase.from("advisor_evolution").delete().eq("user_id", userId);
  await supabase
    .from("conversation_summaries")
    .delete()
    .eq("user_id", userId);
}

/** Runs after each exchange — updates memory, conversation summary, evolving model. */
export async function processExchangeForRelationship(
  supabase: SupabaseClient,
  userId: string,
  conversationId: string,
  dossier: CognitiveDossier | null,
  exchange: { role: "user" | "assistant"; content: string }[],
  userMessageCount: number,
) {
  const extracted = await extractRelationshipMemory(exchange);
  if (extracted.items.length) {
    await persistExtractedMemories(
      supabase,
      userId,
      extracted.items.map((i) => ({
        memory_type: i.memory_type,
        content: i.content,
        evidence: i.evidence,
      })),
    );
  }

  const { data: existingSummary } = await supabase
    .from("conversation_summaries")
    .select("summary, open_threads, message_count")
    .eq("conversation_id", conversationId)
    .maybeSingle();

  const { data: recentMsgs } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(16);

  const transcript = (recentMsgs ?? []).reverse();

  const { summary, open_threads } = await summarizeConversation({
    previousSummary: existingSummary?.summary ?? "",
    previousThreads: existingSummary?.open_threads ?? [],
    transcript,
  });

  const msgCount = transcript.length;
  await supabase.from("conversation_summaries").upsert({
    conversation_id: conversationId,
    user_id: userId,
    summary,
    open_threads,
    message_count: msgCount,
    updated_at: new Date().toISOString(),
  });

  if (!dossier) return;

  const shouldEvolve = userMessageCount % 2 === 0 || userMessageCount <= 2;
  if (!shouldEvolve) return;

  const { data: evolution } = await supabase
    .from("advisor_evolution")
    .select("evolving_summary, shift_notes, progress_notes, version")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: allSummaries } = await supabase
    .from("conversation_summaries")
    .select("summary")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(8);

  const { data: topMemory } = await supabase
    .from("cognitive_memory")
    .select("memory_type, content, observation_count")
    .eq("user_id", userId)
    .eq("archived", false)
    .order("weight", { ascending: false })
    .limit(30);

  const latestExchange = exchange
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n\n");

  const evolved = await evolveAdvisorModel({
    dossierBlock: dossierBlock(dossier),
    previousEvolution: evolution ?? null,
    conversationSummaries: (allSummaries ?? []).map((s) => s.summary),
    memoryLines: (topMemory ?? []).map(
      (m) =>
        `[${m.memory_type}] ${m.content}${m.observation_count && m.observation_count > 1 ? ` (${m.observation_count}x)` : ""}`,
    ),
    latestExchange,
  });

  if (!evolved.evolving_summary) return;

  await supabase.from("advisor_evolution").upsert({
    user_id: userId,
    evolving_summary: evolved.evolving_summary,
    shift_notes: evolved.shift_notes,
    progress_notes: evolved.progress_notes,
    version: (evolution?.version ?? 0) + 1,
    updated_at: new Date().toISOString(),
  });
}
