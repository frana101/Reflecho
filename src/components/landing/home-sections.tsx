"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 pt-[calc(3.75rem+env(safe-area-inset-top,0px)+3rem)] sm:pt-32 pb-20 sm:pb-28">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-[2rem] leading-[1.12] sm:text-[2.75rem] sm:leading-[1.08] font-medium tracking-tight text-balance"
        >
          Finally know your next move.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8 sm:mt-10 text-base sm:text-lg leading-snug text-bone"
        >
          Because the advice is built around you, not the average person.
        </motion.p>
      </div>
    </section>
  );
}

export function AdviceProblem() {
  return (
    <section id="why" className="border-b border-line">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-base sm:text-lg leading-snug text-bone">
            Everyone has advice.
          </p>
          <p className="mt-6 text-base sm:text-lg leading-snug text-bone">
            Start a business. Quit your job. Wake up earlier. Take more risks.
            Work harder. Slow down.
          </p>
          <div className="mt-10 space-y-4 text-base sm:text-lg leading-snug text-bone">
            <p>Most of it isn&apos;t wrong.</p>
            <p>It just wasn&apos;t built for you.</p>
          </div>
          <p className="mt-10 text-base sm:text-lg leading-snug text-bone">
            Two people can have the same goal and need completely different
            guidance. One needs to stop overthinking. The other needs to think
            things through. Most advice treats them the same. That&apos;s why it
            doesn&apos;t stick.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="advisor" className="border-b border-line">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-base sm:text-lg leading-snug text-bone">
            Reflechto learns how you actually think.
          </p>
          <p className="mt-6 text-base sm:text-lg leading-snug text-bone">
            Your patterns. Your blind spots. Your real incentives. How you make
            decisions. Where you get stuck and why.
          </p>
          <p className="mt-10 text-base sm:text-lg leading-snug text-bone">
            Then it gives you guidance built around that — not around the average
            person, not around what worked for someone else.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function WhatYouGet() {
  return (
    <section id="what" className="border-b border-line">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight">
            What you get
          </h2>
          <p className="mt-8 text-base sm:text-lg leading-snug text-bone">
            A personal advisor that knows how you operate.
          </p>
          <p className="mt-6 text-base sm:text-lg leading-snug text-bone">
            Not a chatbot that gives everyone the same answer. Not a personality
            test. Not another framework to memorize.
          </p>
          <p className="mt-6 text-base sm:text-lg leading-snug font-medium">
            An advisor that understands you first — then tells you what to do.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function TriedEverything() {
  return (
    <section id="stuck" className="border-b border-line">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-balance">
            For people who have tried everything else.
          </h2>
          <p className="mt-8 text-base sm:text-lg leading-snug text-bone">
            You&apos;ve watched the videos. Read the books. Listened to the
            podcasts.
          </p>
          <div className="mt-8 space-y-4 text-base sm:text-lg leading-snug text-bone">
            <p>You&apos;re not missing information.</p>
            <p>
              You&apos;re missing advice that actually accounts for who you are.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-24 sm:py-32 text-center pb-safe">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-balance">
            Start free. Find out how you actually think.
          </h2>
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto min-h-[48px] sm:min-w-[220px]">
              <Link href="/auth/sign-up?next=/onboarding">Enter Reflechto</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
