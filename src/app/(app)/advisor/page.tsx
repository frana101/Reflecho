import { createClient } from "@/lib/supabase/server";
import { MirrorChat } from "@/components/mirror/mirror-chat";
import { MirrorSessionsShell } from "@/components/mirror/mirror-sessions";

export const metadata = { title: "Advisor - Reflechto" };

export default async function MirrorIndexPage() {
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

  return (
    <MirrorSessionsShell conversations={convs ?? []}>
      <MirrorChat
        initialConversationId={null}
        initialMessages={[]}
        displayName={profile?.display_name ?? "Subject"}
      />
    </MirrorSessionsShell>
  );
}
