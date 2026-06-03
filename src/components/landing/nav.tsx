"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#protocol", label: "Protocol" },
  { href: "#system", label: "System" },
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
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink-0/60 backdrop-blur-xl pt-safe"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3 group min-w-0">
            <span className="inline-block h-2 w-2 bg-bone group-hover:bg-bone/70 transition-colors shrink-0" />
            <span className="text-[11px] tracking-[0.28em] uppercase font-medium truncate">
              Brain Mirror
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.28em] uppercase text-bone-muted">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-bone transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/auth/sign-up">Begin</Link>
            </Button>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="md:hidden flex h-11 w-11 items-center justify-center border border-line"
            >
              <div className="flex flex-col gap-1.5">
                <span className="block h-px w-5 bg-bone" />
                <span className="block h-px w-5 bg-bone" />
                <span className="block h-px w-5 bg-bone" />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {open && (
        <div className="md:hidden fixed inset-0 z-[60] bg-ink-0/95 backdrop-blur-xl pt-16 pb-safe">
          <nav className="flex flex-col px-4 py-6 gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="min-h-[52px] flex items-center text-[12px] tracking-[0.24em] uppercase text-bone border-b border-line"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/auth/sign-in"
              onClick={() => setOpen(false)}
              className="min-h-[52px] flex items-center text-[12px] tracking-[0.24em] uppercase text-bone-muted"
            >
              Sign In
            </Link>
            <Button asChild size="lg" className="mt-4 min-h-[48px]">
              <Link href="/auth/sign-up" onClick={() => setOpen(false)}>
                Begin
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </>
  );
}
