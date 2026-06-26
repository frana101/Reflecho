import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Overview - Reflechto" };

export default async function OverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: dossier }, { data: convs }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, occupation, subscription_tier, reconstruction_complete_at")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("cognitive_dossiers")
        .select("summary, created_at, version")
        .eq("user_id", user.id)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("conversations")
        .select("id, title, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(6),
    ]);

  return (
    <div className="px-4 sm:px-8 md:px-14 py-10 sm:py-12 md:py-20 max-w-6xl">
      <div className="text-[10px] tracking-[0.32em] uppercase text-bone-muted">
        Overview
      </div>
      <h1 className="mt-4 text-display-lg font-medium tracking-tight text-balance">
        Welcome back, {profile?.display_name ?? "Subject"}.
      </h1>
      <p className="mt-6 max-w-xl leading-snug">
        Your advisor gets sharper the more you use it. Every conversation builds
        on what it already knows about you.
      </p>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
        <Stat
          code="01"
          label="Dossier"
          value={dossier?.version ? `v${dossier.version}` : "Pending"}
        />
        <Stat
          code="02"
          label="Advisor sessions"
          value={String(convs?.length ?? 0)}
        />
      </div>

      {dossier?.summary && (
        <div className="mt-16 border border-line p-10">
          <div className="text-[10px] tracking-[0.32em] uppercase text-bone-muted">
            Your report
          </div>
          <p className="mt-4 text-xl leading-snug text-balance">
            {dossier.summary}
          </p>
          <div className="mt-6 flex gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/dossier">Open dossier</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/advisor">Talk to advisor</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="mt-16">
        <div className="flex items-baseline justify-between border-b border-line pb-4 mb-6">
          <h2 className="text-display-md font-medium tracking-tight">
            Recent sessions
          </h2>
          <Link
            href="/advisor"
            className="text-[10px] tracking-[0.32em] uppercase text-bone-muted hover:text-bone"
          >
            All sessions
          </Link>
        </div>
        {(!convs || convs.length === 0) && (
          <div className="border border-line p-10">
            <p className="leading-snug">
              No sessions yet. Open your advisor and start.
            </p>
            <Button asChild size="md" className="mt-6">
              <Link href="/advisor">Open advisor</Link>
            </Button>
          </div>
        )}
        <ul className="divide-y divide-line border-y border-line">
          {convs?.map((c) => (
            <li key={c.id}>
              <Link
                href={`/advisor/${c.id}`}
                className="flex items-center justify-between px-6 py-5 hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-bone text-balance pr-8 line-clamp-1">
                  {c.title ?? "Untitled exchange"}
                </span>
                <span className="text-[10px] tracking-[0.32em] uppercase text-bone-muted shrink-0">
                  {new Date(c.updated_at).toLocaleDateString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({
  code,
  label,
  value,
}: {
  code: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-black p-8">
      <div className="text-[10px] tracking-[0.32em] uppercase text-bone-muted">
        {code} — {label}
      </div>
      <div className="mt-4 text-4xl font-medium tracking-tight">{value}</div>
    </div>
  );
}
