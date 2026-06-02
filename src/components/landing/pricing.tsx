"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Surface",
    code: "T1",
    price: "Free",
    cadence: "indefinite",
    summary:
      "A glimpse of the protocol. Reconstruction begins but the mirror remains shallow.",
    features: [
      "Partial onboarding (first items only)",
      "Surface cognitive profile",
      "5 mirror conversations",
      "No long-term memory",
    ],
    cta: { label: "Begin Free", href: "/auth/sign-up" },
    variant: "outline" as const,
  },
  {
    name: "Mirror",
    code: "T2",
    price: "$29",
    cadence: "month",
    summary:
      "Full reconstruction. Evolving memory. Continuous psychological modeling.",
    features: [
                  "Complete reconstruction (45-item protocol)",
      "Full 8-layer cognitive dossier",
      "Unlimited mirror chat",
      "Evolving long-term memory",
      "Contradiction tracking",
      "Trajectory analysis",
      "Pattern detection across sessions",
    ],
    cta: { label: "Activate Mirror", href: "/auth/sign-up?tier=mirror" },
    variant: "default" as const,
    featured: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-8 py-32 md:py-48">
        <div className="mb-24 max-w-2xl">
          <span className="text-mono-track text-[10px] text-bone/40">
            Access / Tiers
          </span>
          <h2 className="mt-6 text-display-lg font-light tracking-tight text-balance">
            Two depths of access.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TIERS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`relative border ${
                t.featured
                  ? "border-bone/30 bg-ink-100/60"
                  : "border-line bg-ink-50/40"
              } p-10 flex flex-col`}
            >
              {t.featured && (
                <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-bone to-transparent" />
              )}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-mono-track text-[10px] text-bone/40">
                    {t.code}
                  </span>
                  <h3 className="mt-2 text-3xl font-light tracking-tight">
                    {t.name}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-light">{t.price}</div>
                  <div className="text-[10px] tracking-[0.32em] uppercase text-bone/40">
                    / {t.cadence}
                  </div>
                </div>
              </div>
              <p className="mt-8 text-bone-muted font-light leading-relaxed">
                {t.summary}
              </p>
              <ul className="mt-10 space-y-3 flex-1">
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
              <div className="mt-10">
                <Button asChild variant={t.variant} size="lg" className="w-full">
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
