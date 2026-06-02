"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    id: "01",
    label: "Cognitive Reconstruction",
    title: "We rebuild how you think — from the inside out.",
    body: "Eighteen forced-choice items reconstruct your operating system: hidden tradeoffs, pressure defaults, identity defenses, what collapses when tension rises. Output: a foundational psychological dossier.",
  },
  {
    id: "02",
    label: "Blind Spot Detection",
    title: "It sees what you have been trained not to.",
    body: "The system surfaces the patterns you cannot. Contradictions between what you say you want and what you repeatedly choose. The architecture of self-deception, mapped.",
  },
  {
    id: "03",
    label: "Identity Mapping",
    title: "The self you perform vs. the self that runs you.",
    body: "Aspirational identity, ego attachments, suppressed traits, and the narrative you defend without realizing. Brain Mirror reads the gap and uses it.",
  },
  {
    id: "04",
    label: "Behavioral Pattern Analysis",
    title: "Recurring loops, not isolated decisions.",
    body: "Every conversation feeds the model. Procrastination signatures, dopamine architecture, friction zones, emotional triggers — tracked, compared, drift detected.",
  },
  {
    id: "05",
    label: "Decision Architecture",
    title: "How you decide is more revealing than what you decide.",
    body: "The system reverse-engineers your decision engine: epistemology, risk posture, motivational substrate, and where calibration breaks down under pressure.",
  },
  {
    id: "06",
    label: "Evolving Psychological Memory",
    title: "It remembers. It compares. It updates.",
    body: "Brain Mirror is not stateless. Your cognitive profile is a living document — refined every session, every contradiction, every pattern it confirms or breaks.",
  },
];

export function Sections() {
  return (
    <section id="protocol" className="relative">
      <div className="mx-auto max-w-7xl px-8 py-32 md:py-48">
        <div className="mb-32 max-w-2xl">
          <span className="text-mono-track text-[10px] text-bone/40">
            Protocol / What it does
          </span>
          <h2 className="mt-6 text-display-lg font-light tracking-tight text-balance">
            Not a chatbot. Not a journal.
            <span className="block text-bone-muted italic font-extralight">
              An evolving model of you.
            </span>
          </h2>
        </div>

        <div className="space-y-32 md:space-y-48">
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
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0.3]);
  const reverse = index % 2 === 1;

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className={cn(
        "grid grid-cols-1 md:grid-cols-12 gap-y-10 gap-x-10 items-start",
      )}
    >
      <div className="md:col-span-3 flex items-baseline gap-4 md:sticky md:top-32">
        <span className="text-mono-track text-bone/30 text-[10px]">{id}</span>
        <span className="h-px w-12 bg-line-strong" />
        <span className="text-[11px] tracking-[0.28em] uppercase text-bone-muted">
          {label}
        </span>
      </div>
      <motion.div
        style={{ y }}
        className={cn(
          "md:col-span-9",
          reverse && "md:col-start-4",
        )}
      >
        <h3 className="text-display-lg font-light tracking-tight text-balance max-w-3xl">
          {title}
        </h3>
        <p className="mt-10 max-w-xl text-lg leading-relaxed font-light text-bone-muted">
          {body}
        </p>
      </motion.div>
    </motion.div>
  );
}
