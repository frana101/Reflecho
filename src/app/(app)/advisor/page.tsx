import { createClient } from "@/lib/supabase/server";
import { MirrorChat } from "@/components/mirror/mirror-chat";
import { MirrorSessionsShell } from "@/components/mirror/mirror-sessions";
import { dbRowToDossier } from "@/lib/types/dossier";

export const metadata = { title: "Advisor - Reflechto" };

export default async function AdvisorIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: convs }, { data: dossierRow }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("conversations")
        .select("id, title, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(20),
      supabase
        .from("cognitive_dossiers")
        .select("*")
        .eq("user_id", user.id)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  const dossier = dossierRow ? dbRowToDossier(dossierRow) : null;
  const hasSessions = (convs?.length ?? 0) > 0;

  return (
    <MirrorSessionsShell conversations={convs ?? []}>
      <MirrorChat
        initialConversationId={null}
        initialMessages={[]}
        displayName={profile?.display_name ?? "Subject"}
        openingMessage={dossier?.opening_message}
        showOpeningMessage={!hasSessions && Boolean(dossier?.opening_message)}
      />
    </MirrorSessionsShell>
  );
}
