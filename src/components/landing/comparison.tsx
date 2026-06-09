"use client";

import { motion } from "framer-motion";

const ROWS = [
  {
    most: "Gives you an answer.",
    ours: "Learns who is asking first.",
  },
  {
    most: "Same advice for everyone.",
    ours: "Advice based on your patterns.",
  },
  {
    most: "Forgets you between chats.",
    ours: "Builds on what it learned about you.",
  },
  {
    most: "Sounds smart but generic.",
    ours: "Plain advice that fits your situation.",
  },
];

export function Comparison() {
  return (
    <section id="different" className="border-b border-line">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-balance">
            Why it is different
          </h2>
          <p className="mt-6 text-base sm:text-lg font-light text-bone-muted leading-relaxed">
            Most AI tools give you answers. Reflecho learns the person asking
            before it advises.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-12 sm:mt-16 border border-line"
        >
          <div className="grid grid-cols-2 border-b border-line text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-bone/40">
            <div className="p-4 sm:p-5 border-r border-line">Most AI</div>
            <div className="p-4 sm:p-5">Reflecho</div>
          </div>
          {ROWS.map((row) => (
            <div
              key={row.most}
              className="grid grid-cols-2 border-b border-line last:border-b-0"
            >
              <div className="p-4 sm:p-5 border-r border-line text-sm sm:text-base font-light text-bone-muted leading-relaxed">
                {row.most}
              </div>
              <div className="p-4 sm:p-5 text-sm sm:text-base font-light leading-relaxed">
                {row.ours}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
