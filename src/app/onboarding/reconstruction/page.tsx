import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReconstructionFlow } from "@/components/reconstruction/reconstruction-flow";

export const metadata = { title: "Reconstruction - Reflecho" };

export default async function ReconstructionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in?next=/onboarding/reconstruction");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, onboarding_status")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.display_name) redirect("/onboarding");
  if (profile.onboarding_status === "complete") redirect("/app");

  const { data: existingResponses } = await supabase
    .from("reconstruction_responses")
    .select("question_id, answer_text, answer_choices")
    .eq("user_id", user.id);

  const initialAnswers: Record<string, { text?: string; choices?: string[] }> =
    {};
  for (const r of existingResponses ?? []) {
    initialAnswers[r.question_id] = {
      text: r.answer_text ?? undefined,
      choices: r.answer_choices ?? undefined,
    };
  }

  return (
    <ReconstructionFlow
      displayName={profile.display_name}
      initialAnswers={initialAnswers}
    />
  );
}
