"use client";

import { motion } from "framer-motion";

const EXAMPLES = [
  {
    advice: "Wake up at 5am.",
    works: "Works great if you are a morning person with a clear routine.",
    fails: "Fails if you are a night owl or already running on empty.",
  },
  {
    advice: "Take more risks.",
    works: "Great if you play it too safe and miss chances.",
    fails: "Terrible if you already leap before you look.",
  },
  {
    advice: "Just be yourself.",
    works: "Helpful when you hide what you actually want.",
    fails: "Useless when the problem is you do not know what to change.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="border-b border-line">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-balance">
            Most advice assumes everyone is the same.
          </h2>
          <p className="mt-6 text-base sm:text-lg font-light text-bone-muted leading-relaxed">
            You have probably heard it all. Books. Podcasts. YouTube. Courses.
            The problem is not that you need more advice. The problem is that
            the advice was not made for you.
          </p>
          <p className="mt-4 text-base sm:text-lg font-light text-bone-muted leading-relaxed">
            The same tip helps one person, hurts another, and gets ignored by a
            third. People have different strengths, fears, blind spots, and
            situations. Generic advice ignores that.
          </p>
        </motion.div>

        <div className="mt-12 sm:mt-16 space-y-6">
          {EXAMPLES.map((ex, i) => (
            <motion.div
              key={ex.advice}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="border border-line p-5 sm:p-6"
            >
              <p className="text-lg sm:text-xl font-light">
                Someone says:{" "}
                <span className="text-bone">&ldquo;{ex.advice}&rdquo;</span>
              </p>
              <p className="mt-4 text-sm sm:text-base font-light text-bone-muted leading-relaxed">
                {ex.works}
              </p>
              <p className="mt-2 text-sm sm:text-base font-light text-bone-muted leading-relaxed">
                {ex.fails}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
