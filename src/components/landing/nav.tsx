"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#advisor", label: "How it works" },
  { href: "#why", label: "Why it fails" },
  { href: "#what", label: "What you get" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-black/95 backdrop-blur-xl pt-safe">
        <div className="mx-auto flex h-14 sm:h-16 max-w-3xl items-center justify-between gap-3 px-4 sm:px-8">
          <Link
            href="/"
            className="text-sm sm:text-base font-medium tracking-tight shrink-0"
            onClick={() => setOpen(false)}
          >
            Reflechto
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-bone-muted">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-bone transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex font-light">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="hidden md:inline-flex font-light">
              <Link href="/auth/sign-up?next=/onboarding">Get Started</Link>
            </Button>
            <Button asChild size="sm" className="md:hidden min-h-[40px] px-3 font-light">
              <Link href="/auth/sign-up?next=/onboarding">Start</Link>
            </Button>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="md:hidden flex h-10 w-10 items-center justify-center border border-line shrink-0"
            >
              <span className="sr-only">Menu</span>
              <div className="relative h-3 w-5">
                <span
                  className={cn(
                    "absolute left-0 top-0 block h-px w-5 bg-bone transition-all duration-200",
                    open && "top-[5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[5px] block h-px w-5 bg-bone transition-all duration-200",
                    open && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-[10px] block h-px w-5 bg-bone transition-all duration-200",
                    open && "top-[5px] -rotate-45",
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-[60] bg-black backdrop-blur-xl"
          >
            <div className="flex h-full flex-col pt-[calc(3.5rem+env(safe-area-inset-top,0px))] pb-safe">
              <nav className="flex flex-col px-4 py-4 gap-0 flex-1">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="min-h-[52px] flex items-center text-base border-b border-line"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/auth/sign-in"
                  onClick={() => setOpen(false)}
                  className="min-h-[52px] flex items-center text-base font-light text-bone-muted"
                >
                  Sign in
                </Link>
              </nav>
              <div className="px-4 pb-4">
                <Button asChild size="lg" className="w-full min-h-[48px] font-light">
                  <Link href="/auth/sign-up?next=/onboarding" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
