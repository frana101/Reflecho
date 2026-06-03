import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RedoReconstruction } from "@/components/app-shell/redo-reconstruction";

export const metadata = { title: "Account - Brain Mirror" };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="px-4 sm:px-8 md:px-14 py-10 sm:py-12 md:py-20 max-w-3xl">
      <div className="text-[10px] tracking-[0.32em] uppercase text-bone/40">
        Account
      </div>
      <h1 className="mt-4 text-display-lg font-light tracking-tight text-balance">
        Subject identity.
      </h1>

      <dl className="mt-14 divide-y divide-line border-y border-line">
        <Row label="Display Name" value={profile?.display_name ?? "-"} />
        <Row label="Email" value={user.email ?? "-"} />
        <Row label="Age Range" value={profile?.age_range ?? "-"} />
        <Row label="Occupation" value={profile?.occupation ?? "-"} />
        <Row
          label="Tier"
          value={
            profile?.subscription_tier === "mirror"
              ? "Mirror (Full)"
              : "Surface (Free)"
          }
        />
        <Row
          label="Reconstruction"
          value={
            profile?.onboarding_status === "complete"
              ? `Completed ${
                  profile?.reconstruction_complete_at
                    ? new Date(
                        profile.reconstruction_complete_at,
                      ).toLocaleDateString()
                    : ""
                }`
              : profile?.onboarding_status ?? "Not started"
          }
        />
      </dl>

      {profile?.subscription_tier !== "mirror" && (
        <div className="mt-14 border border-line p-10 bg-ink-100/30">
          <div className="text-[10px] tracking-[0.32em] uppercase text-bone/40">
            Upgrade
          </div>
          <h2 className="mt-4 text-display-md font-light tracking-tight">
            Activate Mirror tier.
          </h2>
          <p className="mt-4 text-bone-muted leading-relaxed max-w-md">
            Full reconstruction, unlimited mirror chat, evolving memory,
            trajectory analysis.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/#pricing">View Tiers</Link>
          </Button>
        </div>
      )}

      <div className="mt-14">
        <RedoReconstruction />
      </div>

      <form action="/auth/sign-out" method="post" className="mt-14">
        <Button type="submit" variant="outline" size="md">
          Sign Out
        </Button>
      </form>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 py-5">
      <dt className="text-[10px] tracking-[0.28em] uppercase text-bone/40">
        {label}
      </dt>
      <dd className="sm:col-span-2 text-base font-light break-words">{value}</dd>
    </div>
  );
}
