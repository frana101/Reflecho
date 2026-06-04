"use client";

import { cn } from "@/lib/utils";

export function SignOutButton({
  className,
  label = "Sign out",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <form action="/auth/sign-out" method="post">
      <button
        type="submit"
        className={cn(
          "text-[10px] tracking-[0.24em] uppercase text-bone/40 hover:text-bone transition-colors min-h-[44px] px-2",
          className,
        )}
      >
        {label}
      </button>
    </form>
  );
}
