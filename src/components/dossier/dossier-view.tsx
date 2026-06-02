"use client";

import { motion } from "framer-motion";
import type {
  ArchetypeAssignment,
  CognitiveDossier,
  PerceptionQuadrant,
  RankedHierarchyItem,
} from "@/lib/types/dossier";
import { CognitiveRadar } from "./radar-chart";

interface Props {
  displayName: string;
  occupation?: string | null;
  generatedAt: string;
  version: number;
  dossier: CognitiveDossier;
}

const DIMENSION_SECTIONS = [
  { key: "reality_processing", code: "01", label: "Reality Processing" },
  { key: "decision_architecture", code: "02", label: "Decision Architecture" },
  { key: "identity_architecture", code: "03", label: "Identity Architecture" },
  { key: "threat_architecture", code: "04", label: "Threat Architecture" },
  { key: "social_operating_system", code: "05", label: "Social Operating System" },
  { key: "execution_system", code: "06", label: "Execution System" },
  { key: "self_deception_architecture", code: "07", label: "Self-Deception Architecture" },
] as const;

const QUADRANT_LABELS: Record<PerceptionQuadrant, string> = {
  elite: "Elite — high accuracy, low bias",
  pattern_seer: "Pattern seer — high accuracy, high bias",
  misses_manipulation: "Misses manipulation — low accuracy, low bias",
  paranoid_interpreter: "Paranoid interpreter — low accuracy, high bias",
};

export function DossierView({
  displayName,
  occupation,
  generatedAt,
  version,
  dossier,
}: Props) {
  const { archetypes, hierarchy } = dossier;

  return (
    <article className="max-w-5xl mx-auto px-8 md:px-14 py-12 md:py-20">
      <header className="border-b border-line pb-12">
        <div className="flex items-center justify-between text-[10px] tracking-[0.32em] uppercase text-bone/40">
          <span>Behavioral Intelligence Report</span>
          <span>
            v{version} · {new Date(generatedAt).toLocaleDateString()}
          </span>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 text-display-xl font-extralight tracking-tighter"
        >
          {displayName}
        </motion.h1>
        {occupation && (
          <p className="mt-2 text-bone-muted text-sm">{occupation}</p>
        )}

        {dossier.core_diagnosis && (
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 border-l-2 border-bone/30 pl-6"
          >
            <p className="text-[10px] tracking-[0.28em] uppercase text-bone/40 mb-3">
              Core Diagnosis
            </p>
            <p className="text-xl md:text-2xl leading-relaxed font-light max-w-3xl">
              {dossier.core_diagnosis}
            </p>
          </motion.blockquote>
        )}

        {archetypes?.primary?.name && (
          <div className="mt-10 flex flex-wrap gap-6 text-sm">
            <ArchetypeBadge label="Primary" a={archetypes.primary} />
            <ArchetypeBadge label="Secondary" a={archetypes.secondary} />
            <ArchetypeBadge label="Shadow" a={archetypes.shadow} />
          </div>
        )}

        {dossier.summary && (
          <motion.p className="mt-12 text-base md:text-lg leading-relaxed font-light max-w-3xl text-bone-muted">
            {dossier.summary}
          </motion.p>
        )}
      </header>

      {hierarchy?.core_drivers?.length ? (
        <section className="mt-20">
          <SectionHeader code="H1" label="Driver Hierarchy" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <HierarchyColumn title="Core Drivers" items={hierarchy.core_drivers} />
            <HierarchyColumn title="Core Threats" items={hierarchy.core_threats} />
            <HierarchyColumn
              title="Core Constraints"
              items={hierarchy.core_constraints}
            />
          </div>
        </section>
      ) : null}

      {dossier.perception_calibration?.summary && (
        <section className="mt-20 border border-line bg-ink-100/30 p-8">
          <SectionHeader code="PC" label="Perception Calibration" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Stat label="Accuracy" value={`${dossier.perception_calibration.accuracy_pct}%`} />
            <Stat
              label="Bias"
              value={dossier.perception_calibration.bias_level}
            />
            <Stat
              label="Quadrant"
              value={QUADRANT_LABELS[dossier.perception_calibration.quadrant]}
            />
          </div>
          <p className="mt-6 text-base leading-relaxed font-light text-bone-muted max-w-3xl">
            {dossier.perception_calibration.summary}
          </p>
        </section>
      )}

      {dossier.reality_processing_score?.total > 0 && (
        <section className="mt-20 border border-line bg-ink-100/30 p-8">
          <SectionHeader code="RP" label="Reality Processing Score" />
          <p className="mt-4 text-3xl font-extralight tabular-nums">
            {dossier.reality_processing_score.correct}/
            {dossier.reality_processing_score.total}
            <span className="ml-3 text-lg text-bone-muted">
              ({dossier.reality_processing_score.accuracy_pct}%)
            </span>
          </p>
          {dossier.reality_processing_score.summary && (
            <p className="mt-4 text-base leading-relaxed font-light text-bone-muted max-w-3xl">
              {dossier.reality_processing_score.summary}
            </p>
          )}
        </section>
      )}

      {dossier.mechanism_map?.length ? (
        <section className="mt-20">
          <SectionHeader code="MM" label="Mechanism Map" />
          <div className="mt-8 space-y-4">
            {dossier.mechanism_map.map((link, i) => (
              <div
                key={i}
                className="border border-line bg-ink-100/30 p-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm"
              >
                <MechanismStep label="Driver" value={link.driver} />
                <MechanismStep label="Threat" value={link.threat} />
                <MechanismStep label="Coping" value={link.coping_strategy} />
                <MechanismStep label="Behavior" value={link.behavior} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dossier.root_causes?.length ? (
        <section className="mt-20">
          <SectionHeader code="RC" label="Root Cause Analysis" />
          <div className="mt-8 space-y-6">
            {dossier.root_causes.map((rc) => (
              <div key={rc.rank} className="border border-line p-6 bg-ink-100/30">
                <div className="flex flex-wrap items-baseline gap-4">
                  <span className="text-[10px] tracking-[0.28em] uppercase text-bone/40">
                    #{rc.rank}
                  </span>
                  <h3 className="text-lg font-light">{rc.mechanism}</h3>
                  <span className="text-xs text-bone-muted tabular-nums">
                    {rc.coverage_pct}% coverage · {rc.confidence_pct}% confidence
                  </span>
                </div>
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {rc.explains.map((e, j) => (
                    <li key={j} className="text-sm text-bone-muted flex gap-3">
                      <span className="mt-2 h-px w-3 bg-bone/30 shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
                {rc.evidence?.length ? (
                  <p className="mt-4 text-[10px] tracking-[0.24em] uppercase text-bone/40">
                    Evidence: {rc.evidence.join(", ")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dossier.evidence_chains?.length ? (
        <section className="mt-20">
          <SectionHeader code="EC" label="Evidence Chains" />
          <div className="mt-8 space-y-6">
            {dossier.evidence_chains.map((chain, i) => (
              <div key={i} className="border border-line p-6 bg-ink-100/30">
                <h3 className="text-base font-light">{chain.claim}</h3>
                <div className="mt-4 space-y-3">
                  {chain.chain.map((step) => (
                    <div key={step.question_id} className="flex gap-4 text-sm">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-bone/40 shrink-0 w-8">
                        {step.question_id}
                      </span>
                      <span className="text-bone-muted">{step.signal}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm font-light">{chain.inference}</p>
                <p className="mt-3 text-[10px] tracking-[0.24em] uppercase text-bone/40">
                  Confidence: {chain.confidence_pct}% · Evidence:{" "}
                  {chain.evidence_count}
                  {chain.counter_evidence?.length
                    ? ` · Counter: ${chain.counter_evidence.join(", ")}`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-20">
        <SectionHeader code="00" label="Measurement Radar" />
        <div className="mt-10 border border-line bg-ink-100/30 p-6">
          <CognitiveRadar scores={dossier.radar_scores ?? {}} />
        </div>
      </section>

      {DIMENSION_SECTIONS.map((s) => {
        const section = (dossier as unknown as Record<
          string,
          { summary: string; bullets: string[]; confidence_pct?: number } | undefined
        >)[s.key];
        if (!section?.summary) return null;
        return (
          <motion.section key={s.key} className="mt-24">
            <SectionHeader code={s.code} label={s.label} />
            {section.confidence_pct != null && (
              <p className="mt-3 text-[10px] tracking-[0.28em] uppercase text-bone/40">
                Confidence: {section.confidence_pct}%
              </p>
            )}
            <p className="mt-6 text-xl leading-relaxed font-light max-w-3xl">
              {section.summary}
            </p>
            <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {section.bullets?.map((b, j) => (
                <li
                  key={j}
                  className="text-sm font-light text-bone-muted flex items-start gap-4"
                >
                  <span className="mt-2.5 h-px w-4 bg-bone/40 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.section>
        );
      })}

      {dossier.self_deception_detector?.length ? (
        <section className="mt-24">
          <SectionHeader code="SD" label="Self-Deception Detector" />
          <div className="mt-8 space-y-6">
            {dossier.self_deception_detector.map((item, i) => (
              <div key={i} className="border border-line p-6 bg-ink-100/30">
                <p className="text-sm font-light italic text-bone">
                  &ldquo;{item.claim}&rdquo;
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[10px] tracking-[0.24em] uppercase text-bone/40">
                      Evidence for
                    </span>
                    <p className="mt-1 text-bone-muted">
                      {item.evidence_for.join(", ") || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] tracking-[0.24em] uppercase text-bone/40">
                      Evidence against
                    </span>
                    <p className="mt-1 text-bone-muted">
                      {item.evidence_against.join(", ") || "—"}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-bone-muted">{item.inference}</p>
                <p className="mt-2 text-[10px] tracking-[0.24em] uppercase text-bone/40">
                  Confidence: {item.confidence_pct}%
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dossier.behavioral_predictions?.length ? (
        <section className="mt-24">
          <SectionHeader code="BP" label="Behavioral Predictions" />
          <div className="mt-8 space-y-4">
            {dossier.behavioral_predictions.map((p, i) => (
              <div key={i} className="border border-line p-6 bg-ink-100/30 text-sm">
                <p className="text-[10px] tracking-[0.24em] uppercase text-bone/40">
                  Situation
                </p>
                <p className="mt-1 font-light">{p.situation}</p>
                <p className="mt-4 text-[10px] tracking-[0.24em] uppercase text-bone/40">
                  Prediction
                </p>
                <p className="mt-1 text-bone-muted">{p.prediction}</p>
                <p className="mt-4 text-[10px] tracking-[0.24em] uppercase text-bone/40">
                  Mechanism · {p.confidence_pct}% confidence
                </p>
                <p className="mt-1 text-bone-muted">{p.mechanism}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dossier.strategic_adaptations?.length ? (
        <section className="mt-24">
          <SectionHeader code="SA" label="Strategic Adaptations" />
          <ul className="mt-6 space-y-4 max-w-3xl">
            {dossier.strategic_adaptations.map((p, i) => (
              <li
                key={i}
                className="text-sm font-light text-bone flex gap-4 leading-relaxed"
              >
                <span className="mt-2 h-px w-4 bg-bone shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dossier.blind_spot_architecture?.items?.length ? (
        <section className="mt-24">
          <SectionHeader code="BS" label="Blind Spots" />
          <p className="mt-6 text-xl font-light max-w-3xl">
            {dossier.blind_spot_architecture.summary}
          </p>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {dossier.blind_spot_architecture.items.map((b, i) => (
              <div key={i} className="py-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-base font-light text-bone">{b.pattern}</div>
                <div className="text-sm text-bone-muted md:col-span-2">{b.evidence}</div>
                <div className="text-sm text-bone-muted">
                  <span className="italic">Cost: {b.likely_cost}</span>
                  {b.confidence_pct != null && (
                    <span className="block mt-1 text-[10px] tracking-[0.2em] uppercase text-bone/40">
                      {b.confidence_pct}% confidence
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <footer className="mt-24 border-t border-line pt-8 text-[10px] tracking-[0.32em] uppercase text-bone/30 flex justify-between">
        <span>End of report</span>
        <span>Continues in the mirror.</span>
      </footer>
    </article>
  );
}

function SectionHeader({ code, label }: { code: string; label: string }) {
  return (
    <div className="flex items-baseline gap-6 border-b border-line pb-4">
      <span className="text-mono-track text-[10px] text-bone/30">{code}</span>
      <span className="h-px w-10 bg-line-strong" />
      <h2 className="text-[11px] tracking-[0.32em] uppercase text-bone">
        {label}
      </h2>
    </div>
  );
}

function ArchetypeBadge({ label, a }: { label: string; a: ArchetypeAssignment }) {
  if (!a?.name) return null;
  return (
    <div className="border border-line px-4 py-3 bg-ink-100/30">
      <p className="text-[10px] tracking-[0.24em] uppercase text-bone/40">{label}</p>
      <p className="mt-1 text-bone font-light">
        {a.name}{" "}
        <span className="text-bone-muted tabular-nums">{a.score_pct}%</span>
      </p>
      <p className="mt-1 text-xs text-bone-muted">
        {a.core_drive} · {a.weapon} · blind: {a.blind_spot}
      </p>
    </div>
  );
}

function HierarchyColumn({
  title,
  items,
}: {
  title: string;
  items: RankedHierarchyItem[];
}) {
  if (!items?.length) return null;
  return (
    <div className="border border-line p-6 bg-ink-100/30">
      <h3 className="text-[10px] tracking-[0.28em] uppercase text-bone/40">
        {title}
      </h3>
      <ol className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.rank}>
            <div className="flex items-baseline gap-2">
              <span className="text-bone/40 text-xs">{item.rank}.</span>
              <span className="font-light">{item.label}</span>
              <span className="text-bone-muted text-sm tabular-nums">
                {item.score_pct}%
              </span>
            </div>
            <p className="mt-1 text-xs text-bone-muted leading-relaxed">
              {item.explanation}
            </p>
            <p className="mt-2 text-[10px] tracking-[0.2em] uppercase text-bone/40">
              {item.confidence} · {item.confidence_pct}% ·{" "}
              {item.evidence.join(", ")}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.24em] uppercase text-bone/40">{label}</p>
      <p className="mt-1 text-lg font-light capitalize">{value}</p>
    </div>
  );
}

function MechanismStep({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.24em] uppercase text-bone/40">{label}</p>
      <p className="mt-1 font-light">{value}</p>
    </div>
  );
}
