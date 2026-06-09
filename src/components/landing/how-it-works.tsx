"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    step: "1",
    title: "Answer questions.",
    body: "About how you decide, what you avoid, what keeps coming up. Takes about 20 minutes.",
  },
  {
    step: "2",
    title: "The AI learns how you think.",
    body: "It picks up on your patterns — what motivates you, where you get stuck, what you tend to repeat.",
  },
  {
    step: "3",
    title: "Talk to your mentor.",
    body: "Ask about work, relationships, decisions, habits — normal stuff you actually deal with.",
  },
  {
    step: "4",
    title: "Get advice based on you.",
    body: "Not a copy-paste answer from the internet. Advice that accounts for how you actually work.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-line bg-ink-50/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight">
            How it works
          </h2>
        </motion.div>

        <ol className="mt-12 sm:mt-16 space-y-8 sm:space-y-10">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="flex gap-5 sm:gap-6"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-line text-sm font-light text-bone-muted">
                {s.step}
              </span>
              <div>
                <h3 className="text-xl sm:text-2xl font-light tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-base font-light text-bone-muted leading-relaxed">
                  {s.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
