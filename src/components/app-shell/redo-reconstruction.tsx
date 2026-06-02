"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { wipeOnboardingClientState } from "@/store/onboarding-store";

export function RedoReconstruction() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redo = async () => {
    if (
      !confirm(
        "This will delete your current dossier, every memory cell, every conversation, and every saved answer — and restart you at question 1 with the latest system. Continue?",
      )
    )
      return;
    setLoading(true);
    setError(null);
    try {
      try {
        localStorage.removeItem("brain-mirror-onboarding-v2");
        localStorage.removeItem("brain-mirror-onboarding-v3");
        localStorage.removeItem("brain-mirror-onboarding-v4");
        localStorage.removeItem("brain-mirror-onboarding-v5");
        localStorage.removeItem("brain-mirror-onboarding-v6");
        localStorage.removeItem("brain-mirror-onboarding-v7");
        localStorage.removeItem("brain-mirror-onboarding-v8");
      } catch {}
      const res = await fetch("/api/reconstruction/reset", {
        method: "POST",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Reset failed.");
      wipeOnboardingClientState();
      router.push("/onboarding/reconstruction");
      router.refresh();
    } catch (e) {
      const m = e instanceof Error ? e.message : "Reset failed.";
      setError(m);
      setLoading(false);
    }
  };

  return (
    <div className="border border-line p-10 bg-ink-100/30">
      <div className="text-[10px] tracking-[0.32em] uppercase text-bone/40">
        Re-run Protocol
      </div>
      <h2 className="mt-4 text-display-md font-light tracking-tight">
        Redo reconstruction.
      </h2>
      <p className="mt-4 text-bone-muted leading-relaxed max-w-md">
        Wipe everything and re-run the full assessment with the current
        analysis system. Use this when you want a fresh, sharper dossier — or
        after a major life shift.
      </p>
      {error && (
        <div className="mt-4 border border-bone/20 bg-bone/5 px-4 py-3 text-[12px] text-bone/80 leading-relaxed">
          {error}
        </div>
      )}
      <Button
        size="lg"
        variant="outline"
        className="mt-8"
        onClick={redo}
        disabled={loading}
      >
        {loading ? "Resetting..." : "Wipe & redo reconstruction"}
      </Button>
    </div>
  );
}
