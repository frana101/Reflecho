"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignOutButton } from "@/components/auth/sign-out-button";

type Mode = "sign-in" | "sign-up";

function finishAuth(
  router: ReturnType<typeof useRouter>,
  next: string,
) {
  router.push(next);
  router.refresh();
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const defaultNext = mode === "sign-up" ? "/onboarding" : "/app";
  const next = params.get("next") ?? defaultNext;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeEmail, setActiveEmail] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      setActiveEmail(data.user?.email ?? null);
    });
  }, [supabase]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "sign-up") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });

        if (signUpError) {
          const alreadyExists =
            signUpError.message.toLowerCase().includes("already registered") ||
            signUpError.message.toLowerCase().includes("already been registered");

          if (alreadyExists) {
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (signInError) throw signInError;
            finishAuth(router, next);
            return;
          }

          throw signUpError;
        }

        if (data.session) {
          finishAuth(router, next);
          return;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!signInError) {
          finishAuth(router, next);
          return;
        }

        throw new Error(
          "Account created but you could not sign in. In Supabase go to Authentication → Providers → Email and turn off “Confirm email”, then try again.",
        );
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      finishAuth(router, next);
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
      className="border border-line bg-black p-6 sm:p-10"
    >
      <h1 className="text-2xl sm:text-display-md font-medium tracking-tight">
        {isSignUp ? "Create your account" : "Sign in"}
      </h1>
      <p className="mt-3 text-sm leading-snug">
        {isSignUp
          ? "Enter your email and password to get started."
          : "Welcome back."}
      </p>

      {activeEmail && (
        <div className="mt-6 border border-line px-4 py-4 text-left">
          <p className="text-[10px] tracking-[0.24em] uppercase text-bone-muted">
            Already signed in
          </p>
          <p className="mt-2 text-sm text-bone break-all">{activeEmail}</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="min-h-[44px]"
              onClick={() => finishAuth(router, next)}
            >
              Continue as this account
            </Button>
            <SignOutButton
              label="Sign out & switch account"
              className="min-h-[44px] flex items-center justify-center sm:justify-start"
            />
          </div>
        </div>
      )}

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
        <span className="text-[10px] tracking-[0.32em] uppercase text-bone-muted">
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
            placeholder="you@example.com"
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

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Working…" : isSignUp ? "Begin" : "Sign in"}
        </Button>
      </form>

      <p className="mt-8 text-center text-[12px] text-bone-muted">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-bone hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            No account yet?{" "}
            <Link
              href="/auth/sign-up?next=/onboarding"
              className="text-bone hover:underline"
            >
              Create one
            </Link>
          </>
        )}
      </p>
    </motion.div>
  );
}
