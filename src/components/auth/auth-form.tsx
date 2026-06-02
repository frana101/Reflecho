"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "sign-in" | "sign-up";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const supabase = createClient();

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      if (mode === "sign-up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (error) throw error;
        setInfo(
          "Check your email to confirm — then the protocol begins.",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setLoading(false);
    }
  };

  const isSignUp = mode === "sign-up";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="border border-line bg-ink-100/40 p-10"
    >
      <span className="text-mono-track text-[10px] text-bone/40">
        {isSignUp ? "Initiate Reconstruction" : "Resume Protocol"}
      </span>
      <h1 className="mt-4 text-display-md font-light tracking-tight">
        {isSignUp ? "Begin." : "Continue."}
      </h1>
      <p className="mt-3 text-bone-muted text-sm leading-relaxed font-light">
        {isSignUp
          ? "Create credentials to start the cognitive reconstruction protocol."
          : "Authenticate to access your evolving cognitive dossier."}
      </p>

      <div className="mt-8">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleGoogle}
          disabled={loading}
        >
          Continue with Google
        </Button>
      </div>

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-line" />
        <span className="text-[10px] tracking-[0.32em] uppercase text-bone/30">
          or
        </span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={handleEmail} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@signal.io"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="border border-bone/20 bg-bone/5 px-4 py-3 text-[12px] text-bone/80 leading-relaxed">
            {error}
          </div>
        )}
        {info && (
          <div className="border border-line bg-ink-200/40 px-4 py-3 text-[12px] text-bone-muted leading-relaxed">
            {info}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading
            ? "Working…"
            : isSignUp
              ? "Begin Reconstruction"
              : "Enter Mirror"}
        </Button>
      </form>

      <p className="mt-8 text-center text-[12px] text-bone-muted">
        {isSignUp ? (
          <>
            Already enrolled?{" "}
            <Link href="/auth/sign-in" className="text-bone hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            No account yet?{" "}
            <Link href="/auth/sign-up" className="text-bone hover:underline">
              Begin
            </Link>
          </>
        )}
      </p>
    </motion.div>
  );
}
