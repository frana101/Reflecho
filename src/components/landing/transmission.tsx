"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Transmission() {
  return (
    <section className="relative border-t border-line overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid mask-radial-fade opacity-40" />
      <div className="relative mx-auto max-w-7xl px-8 py-40 md:py-56 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="text-mono-track text-[10px] text-bone/40"
        >
          Final transmission
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 text-display-xl font-extralight tracking-tighter text-balance"
        >
          You will not be able to{" "}
          <span className="italic font-thin text-bone-muted">unsee</span>
          <br />
          what the mirror shows you.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="mt-12 mx-auto max-w-xl text-lg font-light text-bone-muted leading-relaxed"
        >
          The protocol is not soft. It is precise. Begin only if you want to be
          seen clearly — by yourself.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <Button asChild size="xl">
            <Link href="/auth/sign-up">Begin Reconstruction</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
