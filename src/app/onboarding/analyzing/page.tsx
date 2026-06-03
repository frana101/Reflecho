import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AnalyzingScreen } from "@/components/reconstruction/analyzing-screen";

export const metadata = { title: "Synthesizing - Reflecho" };

export default async function AnalyzingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, onboarding_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.onboarding_status === "complete") redirect("/dossier");
  if (profile?.onboarding_status !== "analyzing" && profile?.onboarding_status !== "in_progress") {
    redirect("/onboarding");
  }

  return <AnalyzingScreen displayName={profile.display_name ?? "Subject"} />;
}
