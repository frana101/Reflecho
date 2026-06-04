"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";

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

function friendlyError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("api key") || m.includes("incorrect api key") || m.includes("invalid_api_key")) {
    return "OpenAI API key is missing or invalid on the server. If you're on Vercel, check Environment Variables and redeploy.";
  }
  if (m.includes("timeout") || m.includes("timed out") || m.includes("504")) {
    return "Analysis timed out. On Vercel Hobby, functions stop after 10 seconds — upgrade to Pro or run locally for the full synthesis.";
  }
  if (m.includes("json") || m.includes("unexpected token")) {
    return "The model returned invalid JSON. Try again — if it keeps failing, the prompt may need a shorter run.";
  }
  return message;
}

export function AnalyzingScreen({ displayName }: { displayName: string }) {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recoverable, setRecoverable] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const runAnalysis = useCallback(async () => {
    setError(null);
    setRecoverable(false);
    setRetrying(true);
    try {
      const res = await fetch("/api/reconstruction/analyze", {
        method: "POST",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(friendlyError(body.error ?? "Analysis failed."));
        setRecoverable(Boolean(body.recover));
        return;
      }
      router.push("/dossier");
      router.refresh();
    } catch (e) {
      const m = e instanceof Error ? e.message : "Unknown error";
      setError(friendlyError(m));
    } finally {
      setRetrying(false);
    }
  }, [router]);

  useEffect(() => {
    const cycle = setInterval(() => {
      setStage((s) => (s + 1) % STAGES.length);
    }, 2200);
    return () => clearInterval(cycle);
  }, []);

  useEffect(() => {
    void runAnalysis();
  }, [attempt, runAnalysis]);

  const backToQuiz = async () => {
    await fetch("/api/reconstruction/abort-analysis", { method: "POST" });
    router.push("/onboarding/reconstruction");
    router.refresh();
  };

  return (
    <div className="relative w-full min-h-[calc(100dvh-4rem)] flex flex-col">
      <div className="flex items-center justify-end px-4 sm:px-8 py-3 border-b border-line shrink-0">
        <SignOutButton label="Sign out & switch account" />
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden px-4 sm:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-bone/30 to-transparent animate-pulse-slow" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-bone/30 to-transparent animate-pulse-slow" />
        </div>

        <div className="relative z-10 w-full max-w-2xl text-center">
          <div className="mb-8 sm:mb-12 inline-flex items-center gap-3 text-[10px] tracking-[0.28em] uppercase text-bone/40">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-bone animate-pulse" />
            <span>{error ? "Synthesis halted" : retrying ? "Synthesis in progress" : "Preparing"}</span>
          </div>

          <h1 className="text-2xl sm:text-display-md font-light tracking-tight text-balance">
            {error ? `Hold on, ${displayName}.` : `Reconstructing ${displayName}.`}
          </h1>

          {!error && (
            <p className="mt-6 sm:mt-8 text-bone-muted text-sm max-w-md mx-auto leading-relaxed px-2">
              Cross-referencing your answers for incentive patterns, contradictions,
              and what actually governs how you operate. This can take up to a minute.
            </p>
          )}

          {!error && (
            <div className="mt-16 sm:mt-20 h-12 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-x-0 text-[11px] sm:text-[12px] tracking-[0.24em] uppercase text-bone shimmer-text px-2"
                >
                  {STAGES[stage]}
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {error && (
            <div className="mt-8 sm:mt-10 max-w-md mx-auto">
              <div className="border border-bone/20 bg-bone/5 px-4 sm:px-5 py-4 text-sm text-bone/80 leading-relaxed text-left">
                {error}
              </div>
              <div className="mt-6 sm:mt-8 flex flex-col gap-3">
                {recoverable ? (
                  <Button size="lg" className="min-h-[48px]" onClick={() => void backToQuiz()}>
                    Finish the quiz
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="min-h-[48px]"
                    disabled={retrying}
                    onClick={() => setAttempt((a) => a + 1)}
                  >
                    {retrying ? "Retrying…" : "Retry synthesis"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="md"
                  className="min-h-[48px]"
                  onClick={() => void backToQuiz()}
                >
                  Back to quiz
                </Button>
                <SignOutButton
                  label="Sign out & use a different account"
                  className="w-full text-center"
                />
              </div>
            </div>
          )}

          {!error && (
            <div className="mt-16 sm:mt-20 text-[10px] tracking-[0.24em] uppercase text-bone/20">
              Keep this tab open
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
