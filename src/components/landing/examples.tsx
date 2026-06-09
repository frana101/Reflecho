"use client";

import { motion } from "framer-motion";

const EXAMPLES = [
  {
    situation: "I keep starting things and never finishing.",
    generic:
      "Break tasks into smaller steps and use a habit tracker.",
    personal:
      "You tend to chase the exciting start and lose steam when it gets boring. Pick one thing. Finish it before you start the next. Your pattern is novelty, not laziness.",
  },
  {
    situation: "I am not sure what career to focus on.",
    generic:
      "Follow your passion and network more.",
    personal:
      "You care about being good at something more than being famous. Stop comparing options by status. Ask which path lets you get visibly better at work you respect.",
  },
  {
    situation: "I keep overthinking decisions.",
    generic:
      "Just decide and move on. Done is better than perfect.",
    personal:
      "You are not afraid of being wrong. You are afraid of closing off better options. Name what you are actually protecting. Then set a deadline and decide.",
  },
  {
    situation: "I know what to do but do not do it.",
    generic:
      "Build discipline. Wake up earlier. Remove distractions.",
    personal:
      "This is not a willpower problem for you. You stall when the next step feels unclear or risky. Make the first move stupidly small so you cannot talk yourself out of it.",
  },
];

export function Examples() {
  return (
    <section id="examples" className="border-b border-line bg-ink-50/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight">
            What it sounds like
          </h2>
          <p className="mt-6 text-base sm:text-lg font-light text-bone-muted leading-relaxed">
            Normal problems. Not dramatic life changes. Here is generic advice
            vs advice that fits the person.
          </p>
        </motion.div>

        <div className="mt-12 sm:mt-16 space-y-8">
          {EXAMPLES.map((ex, i) => (
            <motion.div
              key={ex.situation}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="border border-line p-5 sm:p-6"
            >
              <p className="text-base sm:text-lg font-light leading-relaxed">
                &ldquo;{ex.situation}&rdquo;
              </p>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-bone/40 mb-2">
                    Generic advice
                  </p>
                  <p className="text-sm sm:text-base font-light text-bone-muted leading-relaxed">
                    {ex.generic}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-bone/40 mb-2">
                    Advice for you
                  </p>
                  <p className="text-sm sm:text-base font-light leading-relaxed">
                    {ex.personal}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
