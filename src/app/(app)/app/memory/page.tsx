import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Memory - Brain Mirror" };

const TYPE_LABELS: Record<string, string> = {
  theme: "Theme",
  fear: "Fear",
  goal: "Goal",
  contradiction: "Contradiction",
  behavioral_pattern: "Pattern",
  emotional_state: "State",
  recurring_phrase: "Phrase",
  motivation: "Motivation",
  identity: "Identity",
  trigger: "Trigger",
};

export default async function MemoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: memories } = await supabase
    .from("cognitive_memory")
    .select("*")
    .eq("user_id", user.id)
    .eq("archived", false)
    .order("weight", { ascending: false })
    .order("last_observed_at", { ascending: false });

  const grouped: Record<string, typeof memories> = {};
  for (const m of memories ?? []) {
    (grouped[m.memory_type] ??= []).push(m);
  }

  return (
    <div className="px-8 md:px-14 py-12 md:py-20 max-w-5xl">
      <div className="text-[10px] tracking-[0.32em] uppercase text-bone/40">
        Long-term Memory
      </div>
      <h1 className="mt-4 text-display-lg font-light tracking-tight text-balance">
        What the mirror remembers.
      </h1>
      <p className="mt-6 max-w-2xl text-bone-muted leading-relaxed">
        Each cell is a stable observation the system carries into every future
        session. Some were seeded from the reconstruction. Others emerged from
        what you said in the mirror.
      </p>

      {(!memories || memories.length === 0) && (
        <div className="mt-16 border border-line p-10 bg-ink-100/30">
          <p className="text-bone-muted font-light">
            No memory cells yet. Begin a session in the mirror.
          </p>
        </div>
      )}

      <div className="mt-16 space-y-14">
        {Object.entries(grouped).map(([type, items]) => (
          <section key={type}>
            <h2 className="text-[11px] tracking-[0.32em] uppercase text-bone/40 border-b border-line pb-3">
              {TYPE_LABELS[type] ?? type} - {items?.length ?? 0}
            </h2>
            <ul className="mt-6 divide-y divide-line border-b border-line">
              {items?.map((m) => (
                <li key={m.id} className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <div className="text-base font-light text-bone leading-relaxed">
                      {m.content}
                    </div>
                    {m.evidence && (
                      <div className="mt-2 text-xs text-bone-muted italic leading-relaxed">
                        &ldquo;{m.evidence}&rdquo;
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] tracking-[0.32em] uppercase text-bone/30 md:text-right">
                    Observed {m.observation_count ?? 1}x
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
