"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    id: "01",
    label: "Measurement",
    title: "Not who you are — how you run.",
    body: "Forty-five forced-choice scenarios across reality processing, decisions, identity, threats, social dynamics, execution, and self-deception. No trait labels. No Myers-Briggs tone. Every conclusion ties to evidence.",
  },
  {
    id: "02",
    label: "Hierarchy",
    title: "Rank what actually drives you.",
    body: "Core drivers, core threats, and core constraints — scored and ranked. Competence protection vs freedom preservation vs recognition — with confidence levels and question-level evidence, not vibes.",
  },
  {
    id: "03",
    label: "Mechanism map",
    title: "Driver → threat → behavior, in one chain.",
    body: "See how incentives become coping strategies become real-world friction. Root-cause compression explains the most behavior with the fewest mechanisms — not twenty disconnected observations.",
  },
  {
    id: "04",
    label: "Core diagnosis",
    title: "One sentence that explains your operating system.",
    body: "The signature output: a single causal line about how you understand, protect, decide, and execute. Built from evidence chains you can audit — not a personality type name.",
  },
  {
    id: "05",
    label: "Predictions",
    title: "Testable behavioral forecasts.",
    body: "Situation → likely behavior → mechanism → confidence. The report tells you what you'll do under pressure before you do it — including where stated values and actual incentives diverge.",
  },
  {
    id: "06",
    label: "The mirror",
    title: "An advisor that knows your machine.",
    body: "After reconstruction, talk to the mirror. It uses your dossier and evolving memory to challenge rationalizations, surface blind spots early, and push toward action — not validation.",
  },
];

export function Sections() {
  return (
    <section id="protocol" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-20 sm:py-32 md:py-48">
        <div className="mb-16 sm:mb-24 max-w-2xl">
          <span className="text-[10px] tracking-[0.24em] uppercase text-bone/40">
            Protocol / What it does
          </span>
          <h2 className="mt-4 sm:mt-6 text-3xl sm:text-display-lg font-light tracking-tight text-balance">
            Behavioral intelligence,
            <span className="block text-bone-muted italic font-extralight mt-1">
              not a personality quiz.
            </span>
          </h2>
          <p className="mt-6 text-base sm:text-lg font-light text-bone-muted leading-relaxed max-w-xl">
            Reflecho reverse-engineers your operating system — incentives,
            decision architecture, self-protection, and adaptation — then keeps
            updating the model as you use the mirror.
          </p>
        </div>

        <div className="space-y-20 sm:space-y-32 md:space-y-40">
          {SECTIONS.map((s, i) => (
            <Block key={s.id} index={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Block({
  id,
  label,
  title,
  body,
  index,
}: {
  id: string;
  label: string;
  title: string;
  body: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.85, 1], [0.4, 1, 1, 0.4]);
  const reverse = index % 2 === 1;

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start"
    >
      <div className="md:col-span-3 flex items-baseline gap-3 md:sticky md:top-28">
        <span className="text-[10px] tabular-nums text-bone/30 shrink-0">{id}</span>
        <span className="h-px w-8 sm:w-12 bg-line-strong shrink-0" />
        <span className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-bone-muted leading-snug">
          {label}
        </span>
      </div>
      <motion.div
        style={{ y }}
        className={cn("md:col-span-9", reverse && "md:col-start-4")}
      >
        <h3 className="text-2xl sm:text-display-md md:text-display-lg font-light tracking-tight text-balance max-w-3xl">
          {title}
        </h3>
        <p className="mt-6 sm:mt-8 max-w-xl text-base sm:text-lg leading-relaxed font-light text-bone-muted">
          {body}
        </p>
      </motion.div>
    </motion.div>
  );
}
