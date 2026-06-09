"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    summary: "Answer the questions and see your profile. Try the mentor with limited chats.",
    features: [
      "Full question set",
      "Your personal profile",
      "Limited mentor chats",
    ],
    cta: { label: "Start free", href: "/auth/sign-up" },
    variant: "outline" as const,
  },
  {
    name: "Full access",
    price: "$29",
    cadence: "month",
    summary: "Unlimited mentor chats and a profile that keeps learning as you talk.",
    features: [
      "Everything in free",
      "Unlimited mentor chats",
      "Remembers what it learns about you",
      "Full written profile",
    ],
    cta: { label: "Get full access", href: "/auth/sign-up?tier=mirror" },
    variant: "default" as const,
    featured: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-b border-line bg-ink-50/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight">
            Pricing
          </h2>
          <p className="mt-6 text-base sm:text-lg font-light text-bone-muted leading-relaxed">
            Start free. Upgrade if you want unlimited access to your mentor.
          </p>
        </motion.div>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`flex flex-col border p-6 sm:p-8 ${
                t.featured
                  ? "border-bone/30 bg-ink-100/50"
                  : "border-line bg-ink-0/40"
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-xl sm:text-2xl font-light">{t.name}</h3>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-light tabular-nums">{t.price}</span>
                  {t.cadence && (
                    <span className="block text-[10px] tracking-[0.16em] uppercase text-bone/40">
                      / {t.cadence}
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-4 text-sm sm:text-base font-light text-bone-muted leading-relaxed">
                {t.summary}
              </p>
              <ul className="mt-6 space-y-2 flex-1">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className="text-sm font-light text-bone-muted flex gap-2"
                  >
                    <span className="text-bone/40 shrink-0">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button asChild variant={t.variant} size="lg" className="w-full min-h-[48px]">
                  <Link href={t.cta.href}>{t.cta.label}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
