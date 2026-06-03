"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GridOverlay } from "@/components/ambient/grid-overlay";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-end sm:justify-center overflow-hidden">
      <GridOverlay />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-8 pt-[calc(3.75rem+env(safe-area-inset-top,0px)+2rem)] sm:pt-32 pb-16 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[10px] tracking-[0.18em] uppercase text-bone-muted max-w-full"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-bone animate-pulse-slow shrink-0" />
          <span className="truncate">Behavioral intelligence · not a personality test</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-10 text-[2.5rem] leading-[1.05] sm:text-display-2xl font-light tracking-tighter text-balance"
        >
          Reverse-engineer
          <br />
          how you{" "}
          <span className="font-extralight italic text-bone-muted">operate.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-8 max-w-xl text-base sm:text-lg leading-relaxed font-light text-bone-muted text-balance"
        >
          Reflecho maps your incentives, decision patterns, blind spots, and
          execution mechanics — then gives you a mirror that advises like an
          operator, not a therapist.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <Button asChild size="lg" className="w-full sm:w-auto min-h-[48px]">
            <Link href="/auth/sign-up">Begin assessment</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto min-h-[48px]">
            <Link href="#protocol">See the protocol</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="mt-12 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-x-10 sm:gap-y-8 border-t border-line pt-8 sm:pt-10"
        >
          {STATS.map((s) => (
            <div key={s.label} className="min-w-0">
              <span className="block text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.24em] uppercase text-bone/40 leading-snug">
                {s.label}
              </span>
              <span className="mt-2 block font-light text-lg sm:text-2xl tracking-tight leading-snug">
                {s.value}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3 text-[10px] tracking-[0.28em] uppercase text-bone/40"
      >
        <span>scroll</span>
        <span className="h-12 w-px bg-gradient-to-b from-bone/40 to-transparent" />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-ink-0 to-transparent" />
    </section>
  );
}

const STATS = [
  { label: "Assessment", value: "45 items" },
  { label: "Output", value: "Operating report" },
  { label: "Evidence", value: "Auditable" },
  { label: "Mirror", value: "Strategic advisor" },
];
