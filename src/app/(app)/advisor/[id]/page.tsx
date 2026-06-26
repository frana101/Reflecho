import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MirrorChat, type ChatMessage } from "@/components/mirror/mirror-chat";
import { MirrorSessionsShell } from "@/components/mirror/mirror-sessions";

export default async function MirrorConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  const { data: convs } = await supabase
    .from("conversations")
    .select("id, title, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(20);

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, title")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!conversation) notFound();

  const { data: messageRows } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true });

  const messages: ChatMessage[] = (messageRows ?? [])
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  return (
    <MirrorSessionsShell conversations={convs ?? []} activeId={id}>
      <MirrorChat
        initialConversationId={id}
        initialMessages={messages}
        displayName={profile?.display_name ?? "Subject"}
      />
    </MirrorSessionsShell>
  );
}
