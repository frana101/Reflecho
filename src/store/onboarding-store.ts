"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AnswerValue {
  text?: string;
  choices?: string[];
  follow_up_text?: string;
}

interface OnboardingState {
  answers: Record<string, AnswerValue>;
  currentIndex: number;
  setAnswer: (questionId: string, value: AnswerValue) => void;
  setIndex: (i: number) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      answers: {},
      currentIndex: 0,
      setAnswer: (questionId, value) =>
        set((s) => ({ answers: { ...s.answers, [questionId]: value } })),
      setIndex: (i) => set({ currentIndex: i }),
      reset: () => set({ answers: {}, currentIndex: 0 }),
    }),
    {
      name: "brain-mirror-onboarding-v8",
      version: 1,
    },
  ),
);

/** After server-side wipe (e.g. redo reconstruction): clear persisted quiz state so hydration starts at Q1. */
export function wipeOnboardingClientState() {
  useOnboardingStore.getState().reset();
  void useOnboardingStore.persist.clearStorage();
}
