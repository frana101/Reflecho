"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#protocol", label: "Protocol" },
  { href: "#system", label: "Output" },
  { href: "#pricing", label: "Access" },
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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink-0/90 backdrop-blur-xl pt-safe">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 min-w-0 shrink"
            onClick={() => setOpen(false)}
          >
            <span className="inline-block h-2 w-2 bg-bone shrink-0" />
            <span className="text-[10px] sm:text-[11px] tracking-[0.22em] sm:tracking-[0.28em] uppercase font-medium truncate">
              Reflecho
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-[11px] tracking-[0.24em] uppercase text-bone-muted">
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
            <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/auth/sign-up">Begin</Link>
            </Button>
            <Button asChild size="sm" className="md:hidden min-h-[40px] px-3 text-[10px] tracking-[0.18em] uppercase">
              <Link href="/auth/sign-up">Begin</Link>
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
            className="md:hidden fixed inset-0 z-[60] bg-ink-0/98 backdrop-blur-xl"
          >
            <div className="flex h-full flex-col pt-[calc(3.5rem+env(safe-area-inset-top,0px))] pb-safe">
              <nav className="flex flex-col px-4 py-4 gap-0 flex-1">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="min-h-[52px] flex items-center text-[12px] tracking-[0.22em] uppercase text-bone border-b border-line"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/auth/sign-in"
                  onClick={() => setOpen(false)}
                  className="min-h-[52px] flex items-center text-[12px] tracking-[0.22em] uppercase text-bone-muted"
                >
                  Sign In
                </Link>
              </nav>
              <div className="px-4 pb-4">
                <Button asChild size="lg" className="w-full min-h-[48px]">
                  <Link href="/auth/sign-up" onClick={() => setOpen(false)}>
                    Begin assessment
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
