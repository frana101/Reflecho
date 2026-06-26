"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { CognitiveDossier } from "@/lib/types/dossier";

interface Props {
  displayName: string;
  occupation?: string | null;
  generatedAt: string;
  version: number;
  dossier: CognitiveDossier;
}

export function DossierView({
  displayName,
  occupation,
  generatedAt,
  version,
  dossier,
}: Props) {
  const { archetype } = dossier;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-8 py-10 sm:py-16 md:py-20">
      <header className="border-b border-line pb-10 sm:pb-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-bone-muted">
          <span>Your report</span>
          <span className="tabular-nums">
            v{version} · {new Date(generatedAt).toLocaleDateString()}
          </span>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-3xl sm:text-4xl font-medium tracking-tight"
        >
          {displayName}
        </motion.h1>
        {occupation && (
          <p className="mt-2 text-bone-muted text-sm">{occupation}</p>
        )}
      </header>

      {dossier.core_diagnosis && (
        <section className="mt-12 sm:mt-16">
          <SectionTitle>Core diagnosis</SectionTitle>
          <p className="mt-4 text-lg sm:text-xl leading-snug text-bone">
            {dossier.core_diagnosis}
          </p>
        </section>
      )}

      {dossier.one_sentence_truth && (
        <section className="mt-12 sm:mt-16 border-y border-line py-8 sm:py-10">
          <SectionTitle>The one sentence truth</SectionTitle>
          <p className="mt-4 text-xl sm:text-2xl leading-snug font-medium tracking-tight text-balance">
            &ldquo;{dossier.one_sentence_truth}&rdquo;
          </p>
        </section>
      )}

      {archetype?.name && (
        <section className="mt-12 sm:mt-16 border border-line p-6 sm:p-8">
          <SectionTitle>Archetype</SectionTitle>
          <h2 className="mt-4 text-2xl sm:text-3xl font-medium tracking-tight">
            {archetype.name}
          </h2>
          {archetype.description && (
            <p className="mt-4 text-base leading-snug text-bone">
              {archetype.description}
            </p>
          )}
          {archetype.strength && (
            <p className="mt-4 text-base">
              <span className="text-bone-muted">Strength — </span>
              {archetype.strength}
            </p>
          )}
          {archetype.weakness && (
            <p className="mt-2 text-base">
              <span className="text-bone-muted">Weakness — </span>
              {archetype.weakness}
            </p>
          )}
        </section>
      )}

      <ThreeList title="Drivers" items={dossier.drivers} />
      <ThreeList title="Threats" items={dossier.threats} />
      <ThreeList title="Constraints" items={dossier.constraints} />

      {dossier.mechanism_map?.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <SectionTitle>Mechanism map</SectionTitle>
          <div className="mt-6 space-y-4">
            {dossier.mechanism_map.map((row, i) => (
              <div
                key={i}
                className="border border-line p-4 sm:p-5 text-sm sm:text-base grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              >
                <MapCell label="Driver" value={row.driver} />
                <MapCell label="Threat" value={row.threat} />
                <MapCell label="Response" value={row.response} />
                <MapCell label="Result" value={row.result} />
              </div>
            ))}
          </div>
        </section>
      )}

      {dossier.blind_spots?.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <SectionTitle>Blind spots</SectionTitle>
          <ul className="mt-6 space-y-5">
            {dossier.blind_spots.map((b, i) => (
              <li key={i} className="border-l-2 border-line pl-4">
                <p className="text-base">{b.pattern}</p>
                {b.cost && (
                  <p className="mt-1 text-sm text-bone-muted">{b.cost}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {dossier.self_deception?.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <SectionTitle>Self-deception detector</SectionTitle>
          <div className="mt-6 space-y-6">
            {dossier.self_deception.map((item, i) => (
              <div key={i} className="border border-line p-5 sm:p-6">
                <p className="text-base italic">
                  &ldquo;{item.belief}&rdquo;
                </p>
                <p className="mt-4 text-sm">
                  <span className="text-bone-muted">Why it feels true — </span>
                  {item.why_it_feels_true}
                </p>
                <p className="mt-2 text-sm">
                  <span className="text-bone-muted">What may be happening — </span>
                  {item.what_may_be_happening}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {dossier.predictions?.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <SectionTitle>Predictions</SectionTitle>
          <div className="mt-6 space-y-4">
            {dossier.predictions.map((p, i) => (
              <div key={i} className="border border-line p-5 sm:p-6">
                <p className="text-sm text-bone-muted">When</p>
                <p className="mt-1 text-base">{p.situation}</p>
                <p className="mt-4 text-sm text-bone-muted">You&apos;ll likely</p>
                <p className="mt-1 text-base">{p.prediction}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {dossier.action_plan?.length > 0 && (
        <section className="mt-12 sm:mt-16">
          <SectionTitle>Action plan</SectionTitle>
          <ol className="mt-6 space-y-4 list-decimal list-inside">
            {dossier.action_plan.map((step, i) => (
              <li
                key={i}
                className="text-base leading-snug pl-2 marker:text-bone-muted"
              >
                {step}
              </li>
            ))}
          </ol>
        </section>
      )}

      <footer className="mt-16 sm:mt-20 border-t border-line pt-8 pb-safe">
        <p className="text-sm leading-snug">
          Your advisor already has this report.{" "}
          <Link href="/advisor" className="underline underline-offset-4 hover:text-bone-muted">
            Continue the conversation →
          </Link>
        </p>
      </footer>
    </article>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] tracking-[0.2em] uppercase text-bone-muted font-medium">
      {children}
    </h2>
  );
}

function ThreeList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <section className="mt-12 sm:mt-16">
      <SectionTitle>{title}</SectionTitle>
      <ul className="mt-4 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-base leading-snug pl-4 border-l border-line">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function MapCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.16em] uppercase text-bone-muted">
        {label}
      </p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
