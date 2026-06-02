import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { IntakeForm } from "@/components/onboarding/intake-form";

export const metadata = { title: "Begin - Brain Mirror" };

export default async function OnboardingEntryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in?next=/onboarding");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, age_range, occupation, onboarding_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.onboarding_status === "complete") redirect("/app");

  return (
    <div className="w-full flex items-center justify-center px-6 py-16">
      <IntakeForm
        initial={{
          display_name: profile?.display_name ?? "",
          age_range: profile?.age_range ?? "",
          occupation: profile?.occupation ?? "",
        }}
      />
    </div>
  );
}
