import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await supabase
    .from("reconstruction_responses")
    .delete()
    .eq("user_id", user.id);
  await supabase.from("cognitive_dossiers").delete().eq("user_id", user.id);
  await supabase.from("cognitive_memory").delete().eq("user_id", user.id);
  await supabase.from("conversations").delete().eq("user_id", user.id);

  await supabase
    .from("profiles")
    .update({
      onboarding_status: "in_progress",
      reconstruction_complete_at: null,
    })
    .eq("id", user.id);

  return NextResponse.json({ ok: true });
}
