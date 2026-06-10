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
          className="text-[2rem] leading-[1.12] sm:text-[2.75rem] sm:leading-[1.08] font-light tracking-tight text-balance"
        >
          Stop Guessing What To Do Next.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-8 sm:mt-10 space-y-4 text-base sm:text-lg font-light text-bone-muted leading-relaxed"
        >
          <p>Most advice isn&apos;t wrong.</p>
          <p>It&apos;s just not built for you.</p>
          <p className="pt-2">
            The internet is full of people telling you what worked for them.
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 space-y-2 text-base sm:text-lg font-light text-bone-muted"
        >
          {[
            "Start a business.",
            "Quit your job.",
            "Wake up earlier.",
            "Take more risks.",
            "Play it safe.",
            "Work harder.",
            "Slow down.",
          ].map((line) => (
            <li key={line}>{line}</li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 space-y-4 text-base sm:text-lg font-light text-bone-muted leading-relaxed"
        >
          <p>Everyone has advice.</p>
          <p>Almost none of it takes you into account.</p>
          <p className="text-bone">That&apos;s the problem.</p>
        </motion.div>
      </div>
    </section>
  );
}

export function AdvisorSection() {
  return (
    <section id="advisor" className="border-b border-line bg-ink-50/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight">
            Meet Your Personal Advisor.
          </h2>
          <div className="mt-8 space-y-4 text-base sm:text-lg font-light text-bone-muted leading-relaxed">
            <p>
              Reflecho learns how you think, make decisions, handle pressure,
              and get stuck.
            </p>
            <p>Then it gives advice based on you.</p>
          </div>
          <ul className="mt-8 space-y-2 text-base sm:text-lg font-light text-bone-muted">
            <li>Not the average person.</li>
            <li>Not some productivity guru.</li>
            <li>Not a generic AI chatbot.</li>
          </ul>
          <p className="mt-8 text-xl sm:text-2xl font-light text-bone">You.</p>
        </motion.div>
      </div>
    </section>
  );
}

export function WhyAdviceFails() {
  return (
    <section id="why" className="border-b border-line">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-balance">
            Why Most Advice Fails
          </h2>
          <p className="mt-8 text-base sm:text-lg font-light text-bone-muted leading-relaxed">
            Because two people can have the same goal and need completely
            different solutions.
          </p>
          <ul className="mt-8 space-y-3 text-base sm:text-lg font-light text-bone-muted leading-relaxed">
            <li>One person needs more confidence.</li>
            <li>Another needs more discipline.</li>
            <li>One needs to stop overthinking.</li>
            <li>Another needs to think things through.</li>
          </ul>
          <p className="mt-8 text-base sm:text-lg font-light leading-relaxed">
            Most advice treats everyone the same.
            <span className="block mt-2 text-bone">Reflecho doesn&apos;t.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    title: "Finds your blind spots",
    body: "The patterns you keep repeating without noticing.",
  },
  {
    title: "Shows what's actually holding you back",
    body: "Not the symptoms. The cause.",
  },
  {
    title: "Gives advice that fits how you operate",
    body: "So you can stop forcing strategies that were never built for you.",
  },
  {
    title: "Helps you make better decisions",
    body: "Career. Business. Money. Relationships. Life. Whatever you're trying to figure out.",
  },
];

export function WhatItDoes() {
  return (
    <section id="what" className="border-b border-line bg-ink-50/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-20 sm:py-28">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
          className="text-2xl sm:text-4xl font-light tracking-tight"
        >
          What Reflecho Does
        </motion.h2>

        <div className="mt-12 sm:mt-16 space-y-10">
          {FEATURES.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <h3 className="text-lg sm:text-xl font-light">{item.title}</h3>
              <p className="mt-2 text-base font-light text-bone-muted leading-relaxed">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STUCK_QUESTIONS = [
  "What should I focus on?",
  "What am I missing?",
  "Why do I keep repeating the same mistakes?",
  "What should I do next?",
];

export function BuiltForStuck() {
  return (
    <section id="stuck" className="border-b border-line">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-balance">
            Built For People Who Feel Stuck
          </h2>
          <p className="mt-8 text-base sm:text-lg font-light text-bone-muted leading-relaxed">
            You&apos;ve watched the videos. Read the books. Listened to the
            podcasts. Consumed more advice than most people ever will.
          </p>
          <p className="mt-4 text-base sm:text-lg font-light text-bone-muted leading-relaxed">
            Yet you&apos;re still not fully sure:
          </p>
          <ul className="mt-6 space-y-3">
            {STUCK_QUESTIONS.map((q) => (
              <li
                key={q}
                className="text-base sm:text-lg font-light text-bone-muted pl-4 border-l border-line"
              >
                {q}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-base sm:text-lg font-light leading-relaxed">
            That&apos;s where Reflecho comes in.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function ClaritySection() {
  return (
    <section className="border-b border-line bg-ink-50/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-balance">
            The Goal Isn&apos;t More Information.
          </h2>
          <p className="mt-8 text-xl sm:text-2xl font-light text-bone">
            It&apos;s clarity.
          </p>
          <p className="mt-6 text-base sm:text-lg font-light text-bone-muted leading-relaxed">
            Because once you&apos;re clear on the right move, action gets much
            easier.
          </p>
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
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-balance">
            Get Your Personal Advisor
          </h2>
          <p className="mt-8 text-base sm:text-lg font-light text-bone-muted leading-relaxed">
            Stop collecting advice.
          </p>
          <p className="mt-2 text-base sm:text-lg font-light text-bone-muted leading-relaxed">
            Start getting advice that actually fits you.
          </p>
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto min-h-[48px] sm:min-w-[200px]">
              <Link href="/auth/sign-up?next=/onboarding">Get Started</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
