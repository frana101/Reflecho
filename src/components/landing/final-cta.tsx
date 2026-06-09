"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-24 sm:py-32 text-center pb-safe">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-4xl font-light tracking-tight text-balance"
        >
          Get advice that actually fits you.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-6 mx-auto max-w-md text-base sm:text-lg font-light text-bone-muted leading-relaxed"
        >
          Answer some questions. Let the AI learn how you think. Then talk to a
          mentor that gives advice based on you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <Button asChild size="lg" className="w-full sm:w-auto min-h-[48px] sm:min-w-[200px]">
            <Link href="/auth/sign-up">Get started free</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
