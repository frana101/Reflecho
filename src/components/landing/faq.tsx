"use client";

import { motion } from "framer-motion";

const FAQS = [
  {
    q: "What makes this different from ChatGPT?",
    a: "ChatGPT gives good general answers. Reflecho learns how you think first — through questions — then gives advice based on your patterns. It is built for one person: you.",
  },
  {
    q: "Why do I need to answer questions first?",
    a: "Without that, the AI would guess. The questions help it understand what motivates you, what you avoid, and where you get stuck. Better input, better advice.",
  },
  {
    q: "How accurate is it?",
    a: "It is only as good as what you share. If you answer honestly, it gets a clear picture. If you game it or rush, the advice will be off. Treat it like talking to a sharp friend who pays attention.",
  },
  {
    q: "Can it be wrong?",
    a: "Yes. It is not magic. It can misread a pattern or miss context you have not shared. Use it as a thinking partner, not a final authority.",
  },
  {
    q: "Who is this for?",
    a: "Anyone who is tired of generic advice and wants help that actually fits how they think — about work, habits, decisions, or getting unstuck.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-b border-line">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-20 sm:py-28">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
          className="text-2xl sm:text-4xl font-light tracking-tight"
        >
          Common questions
        </motion.h2>

        <dl className="mt-12 sm:mt-16 space-y-8 sm:space-y-10">
          {FAQS.map((item, i) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            >
              <dt className="text-base sm:text-lg font-light leading-snug">
                {item.q}
              </dt>
              <dd className="mt-3 text-sm sm:text-base font-light text-bone-muted leading-relaxed">
                {item.a}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
