"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const STAGES = [
  "Scoring reality processing...",
  "Mapping driver hierarchy...",
  "Building evidence chains...",
  "Compressing root causes...",
  "Calibrating perception bias...",
  "Assigning operating patterns...",
  "Generating core diagnosis...",
  "Writing behavioral predictions...",
  "Compiling operating report...",
];

export function AnalyzingScreen({ displayName }: { displayName: string }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recoverable, setRecoverable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const cycle = setInterval(() => {
      if (cancelled) return;
      setStage((s) => (s + 1) % STAGES.length);
    }, 2200);

    const run = async () => {
      try {
        const res = await fetch("/api/reconstruction/analyze", {
          method: "POST",
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (cancelled) return;
          setError(body.error ?? "Analysis failed.");
          setRecoverable(Boolean(body.recover));
          return;
        }
        if (cancelled) return;
        router.push("/dossier");
        router.refresh();
      } catch (e) {
        if (cancelled) return;
        const m = e instanceof Error ? e.message : "Unknown error";
        setError(m);
      }
    };
    run();

    return () => {
      cancelled = true;
      clearInterval(cycle);
    };
  }, [router]);

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-bone/30 to-transparent animate-pulse-slow" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-bone/30 to-transparent animate-pulse-slow" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-8 text-center">
        <div className="mb-12 inline-flex items-center gap-3 text-[10px] tracking-[0.32em] uppercase text-bone/40">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-bone animate-pulse" />
          <span>{error ? "Synthesis halted" : "Synthesis in progress"}</span>
        </div>

        <h1 className="text-display-md font-light tracking-tight text-balance">
          {error ? `Hold on, ${displayName}.` : `Reconstructing ${displayName}.`}
        </h1>

        {!error && (
          <p className="mt-8 text-bone-muted text-sm max-w-md mx-auto leading-relaxed">
            The synthesizer is cross-referencing your answers — looking for
            contradictions, incentive patterns, and what actually governs how
            you operate.
          </p>
        )}

        {!error && (
          <div className="mt-20 h-12 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-x-0 text-[12px] tracking-[0.32em] uppercase text-bone shimmer-text"
              >
                {STAGES[stage]}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {error && (
          <div className="mt-10 max-w-md mx-auto">
            <div className="border border-bone/20 bg-bone/5 px-5 py-4 text-sm text-bone/80 leading-relaxed text-left">
              {error}
            </div>
            <div className="mt-8 flex flex-col gap-3">
              {recoverable ? (
                <Button
                  size="lg"
                  onClick={() => router.push("/onboarding/reconstruction")}
                >
                  Finish the quiz
                </Button>
              ) : (
                <Button size="lg" onClick={() => location.reload()}>
                  Retry synthesis
                </Button>
              )}
              <Button
                variant="ghost"
                size="md"
                onClick={() => router.push("/onboarding/reconstruction")}
              >
                Return to quiz
              </Button>
            </div>
          </div>
        )}

        {!error && (
          <div className="mt-20 text-[10px] tracking-[0.32em] uppercase text-bone/20">
            Do not close this window
          </div>
        )}
      </div>
    </div>
  );
}
