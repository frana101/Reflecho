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
    <div className="relative w-full min-h-[calc(100dvh-4rem)] flex flex-col">
      <div className="sticky top-0 z-10 border-b border-line bg-black/95 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-4 sm:px-8 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-[10px] tracking-[0.28em] uppercase text-bone-muted min-w-0">
            <span className="truncate">{displayName}</span>
            <span className="h-px w-6 bg-line shrink-0 hidden sm:block" />
            <span className="truncate hidden sm:inline">{question.category}</span>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <button
              type="button"
              onClick={startOver}
              className="text-[10px] tracking-[0.28em] uppercase text-bone-muted hover:text-bone transition-colors min-h-[44px] px-2"
            >
              Start over
            </button>
            <span className="h-3 w-px bg-bone/20 hidden sm:block" />
            <span className="text-[10px] tracking-[0.28em] uppercase text-bone-muted tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <div className="h-px w-full bg-line relative overflow-hidden sm:hidden">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 left-0 bg-bone"
            />
          </div>
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

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl"
          >
            <div className="text-[10px] tracking-[0.32em] uppercase text-bone-muted mb-6">
              {question.category}
            </div>
            <h1 className="text-lg md:text-xl font-medium tracking-tight text-balance leading-snug whitespace-pre-line">
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

            <div className="mt-10 sm:mt-12 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="ghost"
                size="md"
                onClick={back}
                disabled={index === 0 || submitting}
                className="w-full sm:w-auto min-h-[48px]"
              >
                Back
              </Button>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <span className="text-center sm:text-left text-[10px] tracking-[0.28em] uppercase text-bone-muted">
                  {savingId === question.id ? "Saving..." : "Autosaved"}
                </span>
                <Button
                  size="md"
                  onClick={next}
                  disabled={!valid || submitting}
                  className="w-full sm:min-w-[180px] min-h-[48px]"
                >
                  {index >= total - 1
                    ? submitting
                      ? "Synthesizing..."
                      : "Submit"
                    : "Continue"}
                </Button>
              </div>
            </div>

            <div className="mt-10 sm:mt-16 hidden md:block text-[10px] tracking-[0.32em] uppercase text-bone-muted">
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
              "text-left border px-4 sm:px-5 py-4 transition-all text-sm leading-snug min-h-[52px]",
              isOn
                ? "border-bone bg-bone text-black"
                : "border-line text-bone hover:border-line-strong",
            )}
          >
            <span className="flex items-center gap-4">
              <span
                className={cn(
                  "inline-block h-2 w-2 rounded-full transition-colors shrink-0",
                  isOn ? "bg-black" : "bg-line",
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
