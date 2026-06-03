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
      <div className="flex items-center justify-between mb-12 text-[10px] tracking-[0.32em] uppercase text-bone/40">
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
              <h2 className="text-2xl sm:text-display-lg font-light tracking-tight text-balance">
                What should the mirror call you?
              </h2>
              <p className="mt-4 text-bone-muted text-sm leading-relaxed max-w-md">
                Your name is the first signal. Use what feels most like you.
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
                  className="text-2xl h-16 font-light tracking-tight"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl sm:text-display-lg font-light tracking-tight text-balance">
                Calibration: age range.
              </h2>
              <p className="mt-4 text-bone-muted text-sm leading-relaxed max-w-md">
                Used only to calibrate cognitive baselines, not to label you.
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
                        ? "border-bone bg-bone/10 text-bone"
                        : "border-line text-bone-muted hover:border-bone/40 hover:text-bone"
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
              <h2 className="text-2xl sm:text-display-lg font-light tracking-tight text-balance">
                What is your work?
              </h2>
              <p className="mt-4 text-bone-muted text-sm leading-relaxed max-w-md">
                One phrase. Not a title - a description of what you actually do.
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
                  className="text-2xl h-16 font-light tracking-tight"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl sm:text-display-lg font-light tracking-tight text-balance">
                You are about to be seen.
              </h2>
              <p className="mt-6 text-bone-muted leading-relaxed max-w-lg">
                The assessment that follows reconstructs how you operate — not
                who you claim to be. Forced tradeoffs, social dilemmas, and
                calibration scales. No personality labels.
              </p>
              <ul className="mt-10 space-y-3 max-w-md">
                {[
                  `${TOTAL_QUESTIONS} assessment items across 4 sections`,
                  "Roughly 18–22 minutes",
                  "Autosaved continuously",
                  "Output: your operating profile + mirror advisor",
                ].map((b) => (
                  <li
                    key={b}
                    className="text-sm font-light text-bone-muted flex items-center gap-3"
                  >
                    <span className="h-px w-4 bg-bone/40" />
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
            {submitting ? "Initializing..." : "Begin Reconstruction"}
          </Button>
        )}
      </div>
    </div>
  );
}
