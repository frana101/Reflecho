import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AdvisorRelationshipContext,
  CrossSessionSnippet,
} from "@/lib/advisor/types";

const SUMMARY_LIMIT = 12;
const SNIPPET_CONVERSATIONS = 5;
const SNIPPET_MESSAGES = 2;
const MEMORY_LIMIT = 50;

export async function loadAdvisorRelationshipContext(
  supabase: SupabaseClient,
  userId: string,
  currentConversationId: string,
): Promise<AdvisorRelationshipContext> {
  const [
    { data: evolution },
    { data: currentSummary },
    { data: summaries },
    { data: memories },
    { count: conversationCount },
    { count: messageCount },
    { count: memoryTotalCount },
    { data: otherConvs },
  ] = await Promise.all([
    supabase
      .from("advisor_evolution")
      .select("evolving_summary, shift_notes, progress_notes, version, updated_at")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("conversation_summaries")
      .select("conversation_id, summary, open_threads, message_count, updated_at")
      .eq("conversation_id", currentConversationId)
      .maybeSingle(),
    supabase
      .from("conversation_summaries")
      .select("conversation_id, summary, open_threads, message_count, updated_at")
      .eq("user_id", userId)
      .neq("conversation_id", currentConversationId)
      .order("updated_at", { ascending: false })
      .limit(SUMMARY_LIMIT),
    supabase
      .from("cognitive_memory")
      .select(
        "memory_type, content, evidence, weight, observation_count, last_observed_at",
      )
      .eq("user_id", userId)
      .eq("archived", false)
      .order("weight", { ascending: false })
      .limit(MEMORY_LIMIT),
    supabase
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("cognitive_memory")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("archived", false),
    supabase
      .from("conversations")
      .select("id, title, updated_at")
      .eq("user_id", userId)
      .neq("id", currentConversationId)
      .order("updated_at", { ascending: false })
      .limit(SNIPPET_CONVERSATIONS),
  ]);

  const crossSessionSnippets = await loadCrossSessionSnippets(
    supabase,
    otherConvs ?? [],
  );

  return {
    evolution: evolution ?? null,
    currentConversationSummary: currentSummary ?? null,
    conversationSummaries: summaries ?? [],
    crossSessionSnippets,
    memories: memories ?? [],
    stats: {
      conversationCount: conversationCount ?? 0,
      messageCount: messageCount ?? 0,
      memoryCount: memoryTotalCount ?? memories?.length ?? 0,
    },
  };
}

async function loadCrossSessionSnippets(
  supabase: SupabaseClient,
  convs: { id: string; title: string | null; updated_at: string }[],
): Promise<CrossSessionSnippet[]> {
  const snippets: CrossSessionSnippet[] = [];

  for (const conv of convs) {
    const { data: msgs } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conv.id)
      .in("role", ["user", "assistant"])
      .order("created_at", { ascending: false })
      .limit(SNIPPET_MESSAGES);

    if (!msgs?.length) continue;

    snippets.push({
      conversation_id: conv.id,
      title: conv.title,
      updated_at: conv.updated_at,
      lines: msgs.reverse().map((m) => ({
        role: m.role as "user" | "assistant",
        content: truncate(m.content, 400),
      })),
    });
  }

  return snippets;
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}
