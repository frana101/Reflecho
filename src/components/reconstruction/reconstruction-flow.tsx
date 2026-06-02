"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { QUESTIONS, type Question } from "@/data/questions";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/onboarding-store";
import { cn } from "@/lib/utils";

interface Props {
  displayName: string;
  initialAnswers: Record<string, { text?: string; choices?: string[] }>;
}

export function ReconstructionFlow({ displayName, initialAnswers }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const { answers, setAnswer, currentIndex, setIndex, reset } =
    useOnboardingStore();

  const [submitting, setSubmitting] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const serverKeys = Object.keys(initialAnswers);
    const staleFullClient =
      serverKeys.length === 0 &&
      QUESTIONS.every((q) => isAnswerValid(q, answers[q.id] ?? {}));
    if (staleFullClient) {
      reset();
      setIndex(0);
      return;
    }

    const merged: Record<string, AnswerLike> = { ...answers };
    for (const [qid, v] of Object.entries(initialAnswers)) {
      if (!merged[qid]) {
        merged[qid] = v;
        setAnswer(qid, v);
      }
    }

    const firstUnanswered = QUESTIONS.findIndex(
      (q) => !isAnswerValid(q, merged[q.id] ?? {}),
    );
    const serverHasAllAnswered = QUESTIONS.every((q) =>
      isAnswerValid(q, initialAnswers[q.id] ?? {}),
    );

    if (firstUnanswered === -1) {
      setIndex(serverHasAllAnswered ? QUESTIONS.length - 1 : 0);
    } else if (
      currentIndex < 0 ||
      currentIndex >= QUESTIONS.length ||
      currentIndex > firstUnanswered
    ) {
      setIndex(firstUnanswered);
    }
  }, [answers, currentIndex, initialAnswers, reset, setAnswer, setIndex]);

  const total = QUESTIONS.length;
  const index = Math.max(0, Math.min(currentIndex, total - 1));
  const question = QUESTIONS[index];
  const answer = answers[question.id] ?? {};

  const completed = useMemo(
    () =>
      QUESTIONS.filter((q) => isAnswerValid(q, answers[q.id] ?? {})).length,
    [answers],
  );

  const progress = Math.round((completed / total) * 100);
  const valid = isAnswerValid(question, answer);

  const persistAnswer = async (q: Question) => {
    const a = answers[q.id];
    if (!a) return;
    setSavingId(q.id);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) return;
      await supabase.from("reconstruction_responses").upsert(
        {
          user_id: user.id,
          question_id: q.id,
          category: q.category,
          question_text: q.question,
          question_type: q.question_type,
          answer_text: a.text ?? null,
          answer_choices: a.choices ?? null,
          psychological_goal: q.psychological_goal,
          traits_to_track: q.traits_to_track,
        },
        { onConflict: "user_id,question_id" },
      );
    } catch (e) {
      console.error(e);
    } finally {
      setSavingId(null);
    }
  };

  const next = async () => {
    if (!valid) return;
    await persistAnswer(question);
    if (index >= total - 1) {
      submitAll();
      return;
    }
    setIndex(index + 1);
  };

  const back = () => {
    if (index === 0) return;
    setIndex(index - 1);
  };

  const submitAll = async () => {
    setSubmitting(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) throw new Error("Not authenticated");

      const rows = QUESTIONS.map((q) => {
        const a = answers[q.id];
        return {
          user_id: user.id,
          question_id: q.id,
          category: q.category,
          question_text: q.question,
          question_type: q.question_type,
          answer_text: a?.text ?? null,
          answer_choices: a?.choices ?? null,
          psychological_goal: q.psychological_goal,
          traits_to_track: q.traits_to_track,
        };
      });

      await supabase
        .from("reconstruction_responses")
        .upsert(rows, { onConflict: "user_id,question_id" });

      await supabase
        .from("profiles")
        .update({ onboarding_status: "analyzing" })
        .eq("id", user.id);

      router.push("/onboarding/analyzing");
      router.refresh();
    } catch (e) {
      console.error(e);
      setSubmitting(false);
    }
  };

  const startOver = async () => {
    if (!confirm("Discard all answers and restart from question 1?")) return;
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (user) {
        await supabase
          .from("reconstruction_responses")
          .delete()
          .eq("user_id", user.id);
      }
    } catch (e) {
      console.error(e);
    }
    reset();
    router.refresh();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft" && e.altKey) back();
      if (e.key === "ArrowRight" && e.altKey) next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="sticky top-0 z-10 border-b border-line bg-ink-0/80 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-8 py-5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-[10px] tracking-[0.32em] uppercase text-bone/40">
            <span>Subject / {displayName}</span>
            <span className="h-px w-8 bg-bone/20" />
            <span>{question.category}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={startOver}
              className="text-[10px] tracking-[0.32em] uppercase text-bone/40 hover:text-bone transition-colors"
            >
              Start over
            </button>
            <span className="h-3 w-px bg-bone/20" />
            <span className="text-[10px] tracking-[0.32em] uppercase text-bone/40">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <div className="hidden md:block h-px w-32 bg-line relative overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-y-0 left-0 bg-bone"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl"
          >
            <div className="text-[10px] tracking-[0.32em] uppercase text-bone/30 mb-6">
              {question.id} - {question.category}
            </div>
            <h1 className="text-lg md:text-xl font-light tracking-tight text-balance leading-relaxed whitespace-pre-line">
              {question.question}
            </h1>

            <div className="mt-12">
              <QuestionInput
                question={question}
                value={answer}
                onChange={(v) => setAnswer(question.id, v)}
                onSubmit={next}
              />
            </div>

            <div className="mt-12 flex items-center justify-between">
              <Button
                variant="ghost"
                size="md"
                onClick={back}
                disabled={index === 0 || submitting}
              >
                Back
              </Button>
              <div className="flex items-center gap-4">
                <span className="text-[10px] tracking-[0.32em] uppercase text-bone/30">
                  {savingId === question.id ? "Saving..." : "Autosaved"}
                </span>
                <Button
                  size="md"
                  onClick={next}
                  disabled={!valid || submitting}
                  className="min-w-[180px]"
                >
                  {index >= total - 1
                    ? submitting
                      ? "Synthesizing..."
                      : "Submit"
                    : "Continue"}
                </Button>
              </div>
            </div>

            <div className="mt-16 text-[10px] tracking-[0.32em] uppercase text-bone/20">
              cmd + enter to continue
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

type AnswerLike = { text?: string; choices?: string[] };

function isAnswerValid(_q: Question, a: AnswerLike) {
  return (a.choices ?? []).length === 1;
}

function QuestionInput({
  question,
  value,
  onChange,
  onSubmit: _onSubmit,
}: {
  question: Question;
  value: AnswerLike;
  onChange: (v: AnswerLike) => void;
  onSubmit: () => void;
}) {
  void _onSubmit;
  const selected = value.choices?.[0];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {question.options.map((c) => {
        const isOn = selected === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange({ choices: [c] })}
            className={cn(
              "text-left border px-5 py-4 transition-all text-sm font-light leading-relaxed",
              isOn
                ? "border-bone bg-bone/10 text-bone"
                : "border-line text-bone-muted hover:border-bone/40 hover:text-bone",
            )}
          >
            <span className="flex items-center gap-4">
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-full transition-colors shrink-0",
                  isOn ? "bg-bone" : "bg-bone/20",
                )}
              />
              {c}
            </span>
          </button>
        );
      })}
    </div>
  );
}
