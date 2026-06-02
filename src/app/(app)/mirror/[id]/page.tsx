import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MirrorChat, type ChatMessage } from "@/components/mirror/mirror-chat";
import { Button } from "@/components/ui/button";

export default async function MirrorConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] h-screen">
      <aside className="hidden lg:flex flex-col border-r border-line bg-ink-50/30">
        <div className="px-6 py-5 border-b border-line flex items-center justify-between">
          <span className="text-[10px] tracking-[0.32em] uppercase text-bone/40">
            Sessions
          </span>
          <Button asChild size="sm" variant="outline">
            <Link href="/mirror">New</Link>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ul>
            {convs?.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/mirror/${c.id}`}
                  className={`block px-6 py-4 border-b border-line transition-colors ${
                    c.id === id
                      ? "bg-bone/[0.04] text-bone"
                      : "hover:bg-bone/[0.02] text-bone-muted"
                  }`}
                >
                  <div className="text-sm font-light line-clamp-1">
                    {c.title ?? "Untitled"}
                  </div>
                  <div className="mt-1 text-[10px] tracking-[0.32em] uppercase text-bone/30">
                    {new Date(c.updated_at).toLocaleDateString()}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <MirrorChat
        initialConversationId={id}
        initialMessages={messages}
        displayName={profile?.display_name ?? "Subject"}
      />
    </div>
  );
}
