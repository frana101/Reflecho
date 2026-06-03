import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/app-shell/sidebar";
import { MobileNav } from "@/components/app-shell/mobile-nav";
import { Grain } from "@/components/ambient/grain";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, onboarding_status")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.onboarding_status === "not_started") {
    redirect("/onboarding");
  }
  if (profile.onboarding_status === "in_progress") {
    redirect("/onboarding/reconstruction");
  }
  if (profile.onboarding_status === "analyzing") {
    redirect("/onboarding/analyzing");
  }

  return (
    <div className="relative min-h-screen flex">
      <Grain />
      <MobileNav displayName={profile.display_name ?? "Subject"} />
      <Sidebar displayName={profile.display_name ?? "Subject"} />
      <div className="flex-1 min-w-0 relative z-[2] pt-14 md:pt-0">{children}</div>
    </div>
  );
}
