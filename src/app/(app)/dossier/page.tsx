import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DossierView } from "@/components/dossier/dossier-view";
import { RegenerateDossier } from "@/components/app-shell/regenerate-dossier";
import { dbRowToDossier } from "@/lib/types/dossier";

export const metadata = { title: "Dossier - Reflechto" };

export default async function DossierPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: dossier }] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, occupation")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("cognitive_dossiers")
      .select("*")
      .eq("user_id", user.id)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (!dossier) {
    return (
      <div className="px-4 sm:px-8 md:px-14 py-16 sm:py-24 max-w-2xl">
        <h1 className="text-display-md font-light tracking-tight">
          No profile yet.
        </h1>
        <p className="mt-6 text-bone-muted leading-relaxed">
          Complete the assessment first. Your advisor uses your report to
          understand how you actually decide.
        </p>
        <Button asChild size="lg" className="mt-10">
          <Link href="/onboarding">Begin Assessment</Link>
        </Button>
      </div>
    );
  }

  const composed = dbRowToDossier(dossier);

  return (
    <>
      <DossierView
        displayName={profile?.display_name ?? "Subject"}
        occupation={profile?.occupation}
        generatedAt={dossier.created_at}
        version={dossier.version}
        dossier={composed}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-8 md:px-14 pb-16 sm:pb-20">
        <RegenerateDossier compact />
      </div>
    </>
  );
}
