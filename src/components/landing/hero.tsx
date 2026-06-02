"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GridOverlay } from "@/components/ambient/grid-overlay";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <GridOverlay />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-8 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 text-mono-track text-[10px] text-bone-muted"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-bone animate-pulse-slow" />
          <span>System / Cognitive Reconstruction v0.1</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 text-display-2xl font-light tracking-tighter text-balance"
        >
          Brain
          <br />
          <span className="font-extralight italic text-bone-muted">Mirror</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 max-w-xl text-lg leading-relaxed font-light text-bone-muted text-balance"
        >
          An evolving AI system that reconstructs how you think — and updates
          its model of you with every conversation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 flex flex-wrap items-center gap-4"
        >
          <Button asChild size="xl">
            <Link href="/auth/sign-up">Begin Reconstruction</Link>
          </Button>
          <Button asChild variant="ghost" size="xl">
            <Link href="#protocol">View Protocol</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.2 }}
          className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-8 border-t border-line pt-10"
        >
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-2">
              <span className="text-[10px] tracking-[0.32em] uppercase text-bone/40">
                {s.label}
              </span>
              <span className="font-light text-2xl tracking-tight">
                {s.value}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[10px] tracking-[0.32em] uppercase text-bone/40"
      >
        <span>scroll</span>
        <span className="h-12 w-px bg-gradient-to-b from-bone/40 to-transparent" />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-0 to-transparent" />
    </section>
  );
}

const STATS = [
  { label: "Operating Mode", value: "Cognitive Mirror" },
  { label: "Memory", value: "Evolving" },
  { label: "Domains", value: "12 Mapped" },
  { label: "Protocol", value: "Continuous" },
];
