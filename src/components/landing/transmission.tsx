"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Transmission() {
  return (
    <section className="relative border-t border-line overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid mask-radial-fade opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 py-24 sm:py-40 md:py-56 text-center pb-safe">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-[10px] tracking-[0.24em] uppercase text-bone/40"
        >
          Ready when you are
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-10 text-3xl sm:text-display-xl font-extralight tracking-tighter text-balance px-2"
        >
          Understand the machine
          <span className="block italic font-thin text-bone-muted mt-1">
            before it runs you.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mt-8 sm:mt-10 mx-auto max-w-lg text-base sm:text-lg font-light text-bone-muted leading-relaxed px-2"
        >
          Twenty minutes of forced tradeoffs. One operating report. A mirror that
          tells you what to do — not how special you are.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.35 }}
          className="mt-10 sm:mt-14 flex justify-center px-4"
        >
          <Button asChild size="lg" className="w-full sm:w-auto min-h-[48px] sm:min-w-[220px]">
            <Link href="/auth/sign-up">Begin assessment</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
