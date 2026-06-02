"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink-0/60 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="inline-block h-2 w-2 bg-bone group-hover:bg-bone/70 transition-colors" />
          <span className="text-[11px] tracking-[0.32em] uppercase font-medium">
            Brain Mirror
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.28em] uppercase text-bone-muted">
          <Link href="#protocol" className="hover:text-bone transition-colors">
            Protocol
          </Link>
          <Link href="#system" className="hover:text-bone transition-colors">
            System
          </Link>
          <Link href="#pricing" className="hover:text-bone transition-colors">
            Access
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth/sign-up">Begin</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
