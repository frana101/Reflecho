"use client";

import { motion } from "framer-motion";

const DOMAINS = [
  {
    label: "01",
    title: "Reality Processing",
    bullets: [
      "Perception calibration",
      "Incentive reading",
      "Social signal accuracy",
    ],
  },
  {
    label: "02",
    title: "Decision Architecture",
    bullets: [
      "Certainty requirements",
      "Risk posture",
      "Analysis vs action",
    ],
  },
  {
    label: "03",
    title: "Identity Architecture",
    bullets: [
      "Core drivers ranked",
      "Status & competence",
      "Stated vs revealed",
    ],
  },
  {
    label: "04",
    title: "Threat Architecture",
    bullets: [
      "Core threats ranked",
      "Protection patterns",
      "Trigger mechanics",
    ],
  },
  {
    label: "05",
    title: "Social Operating System",
    bullets: [
      "Influence & leverage",
      "Coalition behavior",
      "Recognition dynamics",
    ],
  },
  {
    label: "06",
    title: "Execution System",
    bullets: [
      "Friction & delay",
      "Consistency loops",
      "Constraint avoidance",
    ],
  },
  {
    label: "07",
    title: "Self-Deception",
    bullets: [
      "Claim vs behavior gaps",
      "Contradiction flags",
      "Confidence scoring",
    ],
  },
];

const OUTPUTS = [
  "One-sentence core diagnosis",
  "Driver / threat / constraint hierarchy",
  "Mechanism map & root causes",
  "Evidence chains (auditable)",
  "Archetype pattern match",
  "Behavioral predictions",
  "Strategic mirror advisor",
];

export function SystemLayers() {
  return (
    <section id="system" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-20 sm:py-32 md:py-48">
        <div className="mb-12 sm:mb-20 max-w-2xl">
          <span className="text-[10px] tracking-[0.24em] uppercase text-bone/40">
            Output / What you get
          </span>
          <h2 className="mt-4 sm:mt-6 text-3xl sm:text-display-lg font-light tracking-tight text-balance">
            Seven domains measured. One operating report.
          </h2>
          <p className="mt-6 text-base sm:text-lg font-light text-bone-muted leading-relaxed max-w-xl">
            The dossier reads like a behavioral intelligence brief — mechanism
            depth, ranked hierarchy, auditable evidence, and testable
            predictions. Not Enneagram. Not self-help.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border border-line">
          {DOMAINS.map((l, i) => (
            <motion.div
              key={l.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{
                duration: 0.7,
                delay: i * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group border-b border-r border-line p-6 sm:p-8 hover:bg-ink-100/40 transition-colors duration-500"
            >
              <span className="text-[10px] tabular-nums text-bone/30">{l.label}</span>
              <h3 className="mt-4 text-xl sm:text-2xl font-light tracking-tight">
                {l.title}
              </h3>
              <ul className="mt-4 sm:mt-6 space-y-2">
                {l.bullets.map((b) => (
                  <li
                    key={b}
                    className="text-sm font-light text-bone-muted flex items-start gap-3"
                  >
                    <span className="mt-2 h-px w-3 bg-bone/30 shrink-0 group-hover:w-4 transition-all duration-500" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 sm:mt-14 border border-line bg-ink-100/30 p-6 sm:p-10">
          <span className="text-[10px] tracking-[0.24em] uppercase text-bone/40">
            Report includes
          </span>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {OUTPUTS.map((item) => (
              <li
                key={item}
                className="text-sm font-light text-bone-muted flex items-start gap-3"
              >
                <span className="mt-2 h-px w-4 bg-bone/40 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
