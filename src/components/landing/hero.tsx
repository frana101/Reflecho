"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden border-b border-line">
      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-8 pt-[calc(3.75rem+env(safe-area-inset-top,0px)+3rem)] sm:pt-32 pb-20 sm:pb-28">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.25rem] leading-[1.1] sm:text-5xl sm:leading-[1.08] font-light tracking-tight text-balance"
        >
          An AI mentor that learns how you think.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-8 max-w-xl text-base sm:text-lg leading-relaxed font-light text-bone-muted"
        >
          Most advice is written for everyone. That is why so much of it does not
          help. Reflecho asks you questions first, learns how you think, then
          gives advice that fits you — not a generic list from a book or a
          podcast.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-12"
        >
          <Button asChild size="lg" className="w-full sm:w-auto min-h-[48px]">
            <Link href="/auth/sign-up">Get started free</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
