import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExtractedMemory } from "@/lib/memory/extract";

function normalizeContent(content: string) {
  return content.toLowerCase().replace(/\s+/g, " ").trim();
}

function isSimilar(a: string, b: string) {
  const na = normalizeContent(a);
  const nb = normalizeContent(b);
  if (na === nb) return true;
  if (na.length > 20 && nb.length > 20) {
    return na.includes(nb.slice(0, 40)) || nb.includes(na.slice(0, 40));
  }
  return false;
}

/** Merge new memories into existing rows when similar — strengthens advisor over time. */
export async function persistExtractedMemories(
  supabase: SupabaseClient,
  userId: string,
  extracted: ExtractedMemory[],
) {
  if (!extracted.length) return;

  const { data: existing } = await supabase
    .from("cognitive_memory")
    .select("id, memory_type, content, observation_count, weight")
    .eq("user_id", userId)
    .eq("archived", false);

  const rows = existing ?? [];

  for (const mem of extracted) {
    const match = rows.find(
      (r) =>
        r.memory_type === mem.memory_type && isSimilar(r.content, mem.content),
    );

    if (match) {
      await supabase
        .from("cognitive_memory")
        .update({
          observation_count: (match.observation_count ?? 1) + 1,
          weight: Math.min(5, (match.weight ?? 1) + 0.25),
          last_observed_at: new Date().toISOString(),
          evidence: mem.evidence,
        })
        .eq("id", match.id);
      continue;
    }

    const { data: inserted } = await supabase
      .from("cognitive_memory")
      .insert({
        user_id: userId,
        memory_type: mem.memory_type,
        content: mem.content,
        evidence: mem.evidence,
        weight: 1.0,
      })
      .select("id, memory_type, content, observation_count, weight")
      .single();

    if (inserted) rows.push(inserted);
  }
}
