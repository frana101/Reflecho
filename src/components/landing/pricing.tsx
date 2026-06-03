"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Surface",
    code: "T1",
    price: "Free",
    cadence: "to start",
    summary:
      "Run the assessment and preview your operating profile. Mirror access is limited.",
    features: [
      "Full 45-item assessment",
      "Operating report preview",
      "Limited mirror sessions",
      "No long-term memory",
    ],
    cta: { label: "Begin free", href: "/auth/sign-up" },
    variant: "outline" as const,
  },
  {
    name: "Mirror",
    code: "T2",
    price: "$29",
    cadence: "month",
    summary:
      "Full behavioral intelligence report, unlimited mirror, and memory that compounds.",
    features: [
      "Complete operating report",
      "Driver hierarchy & mechanism map",
      "Evidence chains & predictions",
      "Unlimited mirror advisor",
      "Evolving session memory",
      "Self-deception tracking over time",
    ],
    cta: { label: "Activate mirror", href: "/auth/sign-up?tier=mirror" },
    variant: "default" as const,
    featured: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-20 sm:py-32 md:py-48">
        <div className="mb-12 sm:mb-20 max-w-2xl">
          <span className="text-[10px] tracking-[0.24em] uppercase text-bone/40">
            Access / Tiers
          </span>
          <h2 className="mt-4 sm:mt-6 text-3xl sm:text-display-lg font-light tracking-tight text-balance">
            Start with the assessment. Go deeper with the mirror.
          </h2>
          <p className="mt-6 text-base font-light text-bone-muted leading-relaxed max-w-xl">
            Reconstruction takes roughly 20 minutes. The mirror is where the
            model keeps working — challenging blind spots and sharpening decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{
                duration: 0.9,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`relative border flex flex-col p-6 sm:p-10 ${
                t.featured
                  ? "border-bone/30 bg-ink-100/60"
                  : "border-line bg-ink-50/40"
              }`}
            >
              {t.featured && (
                <div className="absolute -top-px left-6 right-6 sm:left-10 sm:right-10 h-px bg-gradient-to-r from-transparent via-bone to-transparent" />
              )}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="text-[10px] tracking-[0.24em] uppercase text-bone/40">
                    {t.code}
                  </span>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-light tracking-tight">
                    {t.name}
                  </h3>
                </div>
                <div className="sm:text-right shrink-0">
                  <div className="text-2xl sm:text-3xl font-light tabular-nums">{t.price}</div>
                  <div className="text-[10px] tracking-[0.24em] uppercase text-bone/40">
                    / {t.cadence}
                  </div>
                </div>
              </div>
              <p className="mt-6 text-sm sm:text-base text-bone-muted font-light leading-relaxed">
                {t.summary}
              </p>
              <ul className="mt-8 space-y-3 flex-1">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className="text-sm font-light text-bone-muted flex items-start gap-3"
                  >
                    <span className="mt-2 h-px w-3 bg-bone/40 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8 sm:mt-10">
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
