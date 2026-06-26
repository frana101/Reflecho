"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";

const STAGES = [
  "Reading your answers...",
  "Mapping how you decide...",
  "Finding your patterns...",
  "Writing your report...",
  "Preparing your advisor...",
];

function friendlyError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("api key") || m.includes("incorrect api key") || m.includes("invalid_api_key")) {
    return "OpenAI API key is missing or invalid on the server. If you're on Vercel, check Environment Variables and redeploy.";
  }
  if (m.includes("temperature") && m.includes("unsupported")) {
    return "Server sent an invalid temperature setting for gpt-5.5. Redeploy the latest code — this was fixed.";
  }
  if (m.includes("timeout") || m.includes("timed out") || m.includes("504")) {
    return "Analysis timed out on the server. Try again in a moment.";
  }
  if (m.includes("json") || m.includes("unexpected token")) {
    return "The model returned invalid JSON. Try again.";
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
      const res = await fetch("/api/reconstruction/analyze", { method: "POST" });
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
        <div className="relative z-10 w-full max-w-2xl text-center">
          <div className="mb-8 sm:mb-12 inline-flex items-center gap-3 text-[10px] tracking-[0.28em] uppercase text-bone-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-bone animate-pulse" />
            <span>{error ? "Stopped" : retrying ? "Building your report" : "Preparing"}</span>
          </div>

          <h1 className="text-2xl sm:text-display-md font-medium tracking-tight text-balance">
            {error ? `Hold on, ${displayName}.` : `Building ${displayName}'s report.`}
          </h1>

          {!error && (
            <p className="mt-6 sm:mt-8 text-sm max-w-md mx-auto leading-snug px-2">
              Turning your answers into a clear read on how you think and what to
              do next. Usually under a minute.
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
                    {retrying ? "Retrying…" : "Retry"}
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
            <div className="mt-16 sm:mt-20 text-[10px] tracking-[0.24em] uppercase text-bone-muted">
              Keep this tab open
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
