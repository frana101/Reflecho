"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TOTAL_QUESTIONS } from "@/data/questions";
import { Button } from "@/components/ui/button";

export function RegenerateDossier({ compact }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const regenerate = async () => {
    if (
      !confirm(
        "Regenerate your dossier using the same quiz answers? Your old report and related memory will be replaced. This usually takes about a minute.",
      )
    )
      return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reconstruction/regenerate", {
        method: "POST",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Regenerate failed.");
      router.push("/onboarding/analyzing");
      router.refresh();
    } catch (e) {
      const m = e instanceof Error ? e.message : "Regenerate failed.";
      setError(m);
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <div>
        <Button
          type="button"
          variant="outline"
          size="md"
          className="min-h-[44px]"
          onClick={regenerate}
          disabled={loading}
        >
          {loading ? "Starting…" : "Regenerate dossier"}
        </Button>
        {error && (
          <p className="mt-3 text-sm text-bone/80 leading-relaxed">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="border border-line p-6 sm:p-10 bg-ink-100/30">
      <h2 className="text-xl sm:text-2xl font-light tracking-tight">
        Regenerate dossier
      </h2>
      <p className="mt-4 text-bone-muted text-sm sm:text-base leading-relaxed max-w-md">
        Keep your quiz answers. Delete the old report and run analysis again
        with the latest system — useful after updates or if you want a fresh
        read without redoing all {TOTAL_QUESTIONS} questions.
      </p>
      {error && (
        <div className="mt-4 border border-bone/20 bg-bone/5 px-4 py-3 text-sm text-bone/80 leading-relaxed">
          {error}
        </div>
      )}
      <Button
        size="lg"
        variant="outline"
        className="mt-6 sm:mt-8 min-h-[48px]"
        onClick={regenerate}
        disabled={loading}
      >
        {loading ? "Starting…" : "Regenerate dossier"}
      </Button>
    </div>
  );
}
