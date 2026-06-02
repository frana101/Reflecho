import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Overview - Brain Mirror" };

export default async function OverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: dossier }, { data: convs }, { data: memCount }] =
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
      supabase
        .from("cognitive_memory")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("archived", false),
    ]);

  const memoryCount = (memCount as unknown as { count?: number } | null)?.count ?? 0;

  return (
    <div className="px-8 md:px-14 py-12 md:py-20 max-w-6xl">
      <div className="text-[10px] tracking-[0.32em] uppercase text-bone/40">
        Operating Status
      </div>
      <h1 className="mt-4 text-display-lg font-light tracking-tight text-balance">
        Welcome back, {profile?.display_name ?? "Subject"}.
      </h1>
      <p className="mt-6 max-w-xl text-bone-muted leading-relaxed">
        The mirror is watching. The dossier deepens with every exchange.
      </p>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
        <Stat
          code="01"
          label="Dossier Version"
          value={dossier?.version ? `v${dossier.version}` : "Pending"}
        />
        <Stat
          code="02"
          label="Conversations"
          value={String(convs?.length ?? 0)}
        />
        <Stat code="03" label="Memory Cells" value={String(memoryCount)} />
      </div>

      {dossier?.summary && (
        <div className="mt-16 border border-line p-10 bg-ink-100/40">
          <div className="text-[10px] tracking-[0.32em] uppercase text-bone/40">
            Synthesis
          </div>
          <p className="mt-4 text-xl leading-relaxed font-light text-bone text-balance">
            {dossier.summary}
          </p>
          <div className="mt-6 flex gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/dossier">Open Full Dossier</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/mirror">Continue Conversation</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="mt-16">
        <div className="flex items-baseline justify-between border-b border-line pb-4 mb-6">
          <h2 className="text-display-md font-light tracking-tight">
            Recent sessions
          </h2>
          <Link
            href="/mirror"
            className="text-[10px] tracking-[0.32em] uppercase text-bone-muted hover:text-bone"
          >
            All sessions
          </Link>
        </div>
        {(!convs || convs.length === 0) && (
          <div className="border border-line p-10 bg-ink-100/30">
            <p className="text-bone-muted font-light">
              No sessions yet. Open the mirror and begin.
            </p>
            <Button asChild size="md" className="mt-6">
              <Link href="/mirror">Open Mirror</Link>
            </Button>
          </div>
        )}
        <ul className="divide-y divide-line border-y border-line">
          {convs?.map((c) => (
            <li key={c.id}>
              <Link
                href={`/mirror/${c.id}`}
                className="flex items-center justify-between px-6 py-5 hover:bg-bone/[0.02] transition-colors"
              >
                <span className="font-light text-bone text-balance pr-8 line-clamp-1">
                  {c.title ?? "Untitled exchange"}
                </span>
                <span className="text-[10px] tracking-[0.32em] uppercase text-bone/40 shrink-0">
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
    <div className="bg-ink-50 p-8">
      <div className="text-[10px] tracking-[0.32em] uppercase text-bone/30">
        {code} - {label}
      </div>
      <div className="mt-4 text-4xl font-light tracking-tight">{value}</div>
    </div>
  );
}
