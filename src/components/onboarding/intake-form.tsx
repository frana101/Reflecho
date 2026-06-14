"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { TOTAL_QUESTIONS } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];

type Step = 0 | 1 | 2 | 3;

interface IntakeFormProps {
  initial: {
    display_name?: string;
    age_range?: string;
    occupation?: string;
  };
}

export function IntakeForm({ initial }: IntakeFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState(initial.display_name ?? "");
  const [age, setAge] = useState(initial.age_range ?? "");
  const [occupation, setOccupation] = useState(initial.occupation ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canAdvance =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && age.trim().length > 0) ||
    (step === 2 && occupation.trim().length > 0) ||
    step === 3;

  const next = () => setStep((s) => Math.min(3, s + 1) as Step);
  const back = () => setStep((s) => Math.max(0, s - 1) as Step);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: name,
          age_range: age,
          occupation,
          onboarding_status: "in_progress",
        })
        .eq("id", user.id);
      if (error) throw error;
      router.push("/onboarding/reconstruction");
      router.refresh();
    } catch (err) {
      const m = err instanceof Error ? err.message : "Failed to save.";
      setError(m);
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center justify-between mb-12 text-[10px] tracking-[0.32em] uppercase text-bone-muted">
        <span>Phase 00 - Intake</span>
        <span>Step {step + 1} / 4</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-[280px]"
        >
          {step === 0 && (
            <div>
              <h2 className="text-2xl sm:text-display-lg font-medium tracking-tight text-balance">
                What should we call you?
              </h2>
              <p className="mt-4 text-sm leading-snug max-w-md">
                Use the name you want on your report.
              </p>
              <div className="mt-12 space-y-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canAdvance && next()}
                  placeholder="e.g. Alex"
                  className="text-2xl h-16 font-medium tracking-tight"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl sm:text-display-lg font-medium tracking-tight text-balance">
                Age range
              </h2>
              <p className="mt-4 text-sm leading-snug max-w-md">
                Helps calibrate your report. Not used to label you.
              </p>
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AGE_RANGES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setAge(r);
                      setTimeout(next, 120);
                    }}
                    className={`min-h-[52px] border text-[13px] tracking-tight transition-all ${
                      age === r
                        ? "border-bone bg-bone text-black"
                        : "border-line text-bone hover:border-line-strong"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl sm:text-display-lg font-medium tracking-tight text-balance">
                What do you do?
              </h2>
              <p className="mt-4 text-sm leading-snug max-w-md">
                One phrase. What you actually do, not your job title.
              </p>
              <div className="mt-12 space-y-3">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  autoFocus
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && canAdvance && next()}
                  placeholder="e.g. Building a software company"
                  className="text-2xl h-16 font-medium tracking-tight"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl sm:text-display-lg font-medium tracking-tight text-balance">
                Ready for your assessment.
              </h2>
              <p className="mt-6 leading-snug max-w-lg">
                20 questions. Under 3 minutes. No personality labels — just a
                clear read on how you think and what to do next.
              </p>
              <ul className="mt-10 space-y-3 max-w-md">
                {[
                  `${TOTAL_QUESTIONS} questions across 4 sections`,
                  "Under 3 minutes",
                  "Autosaved as you go",
                  "Your report + personal advisor",
                ].map((b) => (
                  <li
                    key={b}
                    className="text-sm flex items-center gap-3"
                  >
                    <span className="h-px w-4 bg-line" />
                    {b}
                  </li>
                ))}
              </ul>
              {error && (
                <div className="mt-6 border border-bone/20 bg-bone/5 px-4 py-3 text-[12px] text-bone/80">
                  {error}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 sm:mt-16 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          size="md"
          onClick={back}
          disabled={step === 0 || submitting}
          className="w-full sm:w-auto min-h-[48px]"
        >
          Back
        </Button>
        {step < 3 ? (
          <Button
            size="md"
            onClick={next}
            disabled={!canAdvance}
            className="w-full sm:min-w-[180px] min-h-[48px]"
          >
            Continue
          </Button>
        ) : (
          <Button
            size="md"
            onClick={submit}
            disabled={submitting}
            className="w-full sm:min-w-[220px] min-h-[48px]"
          >
            {submitting ? "Starting..." : "Start assessment"}
          </Button>
        )}
      </div>
    </div>
  );
}
