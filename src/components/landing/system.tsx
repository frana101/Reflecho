"use client";

import { motion } from "framer-motion";

const LAYERS = [
  {
    label: "Layer 01",
    title: "Cognitive Profile",
    bullets: [
      "Reasoning style",
      "Abstraction level",
      "Strategic thinking",
      "Systems orientation",
    ],
  },
  {
    label: "Layer 02",
    title: "Motivational Engine",
    bullets: [
      "Core drivers",
      "Hidden fears",
      "Compensatory motivations",
      "Emotional hunger",
    ],
  },
  {
    label: "Layer 03",
    title: "Identity Structure",
    bullets: [
      "Ego attachments",
      "Identity rigidity",
      "Aspirational self",
      "Hidden insecurity",
    ],
  },
  {
    label: "Layer 04",
    title: "Emotional Architecture",
    bullets: [
      "Regulation patterns",
      "Defense systems",
      "Suppressed emotions",
      "Triggers",
    ],
  },
  {
    label: "Layer 05",
    title: "Execution Architecture",
    bullets: [
      "Consistency patterns",
      "Procrastination mechanics",
      "Action barriers",
      "Friction profile",
    ],
  },
  {
    label: "Layer 06",
    title: "Social Dynamics",
    bullets: [
      "Relational orientation",
      "Communication style",
      "Hierarchy perception",
      "Attachment tendencies",
    ],
  },
  {
    label: "Layer 07",
    title: "Blind Spots",
    bullets: [
      "Self-deception loops",
      "Contradictions",
      "Recurring distortions",
      "Likely sabotages",
    ],
  },
  {
    label: "Layer 08",
    title: "Trajectory Analysis",
    bullets: [
      "Likely future patterns",
      "Highest leverage growth",
      "Collapse risks",
      "Evolution potential",
    ],
  },
];

export function SystemLayers() {
  return (
    <section id="system" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-8 py-32 md:py-48">
        <div className="mb-24 max-w-2xl">
          <span className="text-mono-track text-[10px] text-bone/40">
            System / Architecture
          </span>
          <h2 className="mt-6 text-display-lg font-light tracking-tight text-balance">
            Eight layers of cognitive resolution.
          </h2>
          <p className="mt-8 text-lg font-light text-bone-muted leading-relaxed max-w-xl">
            Every conversation refines all eight. The model deepens over time,
            tracks contradictions across months, and surfaces what you cannot
            see in yourself.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-line">
          {LAYERS.map((l, i) => (
            <motion.div
              key={l.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.9,
                delay: i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative border-line border-r border-b last:border-r-0 md:last:border-r p-8 hover:bg-ink-100/40 transition-colors duration-500"
            >
              <span className="text-mono-track text-[10px] text-bone/30">
                {l.label}
              </span>
              <h3 className="mt-6 text-2xl font-light tracking-tight">
                {l.title}
              </h3>
              <ul className="mt-6 space-y-2">
                {l.bullets.map((b) => (
                  <li
                    key={b}
                    className="text-sm font-light text-bone-muted flex items-center gap-3"
                  >
                    <span className="h-px w-3 bg-bone/30 group-hover:w-5 transition-all duration-500" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
