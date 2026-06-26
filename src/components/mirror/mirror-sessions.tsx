"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MirrorSession {
  id: string;
  title: string | null;
  updated_at: string;
}

interface Props {
  conversations: MirrorSession[];
  activeId?: string | null;
  children: React.ReactNode;
}

export function MirrorSessionsShell({
  conversations,
  activeId,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [activeId]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const sessionList = (
    <ul>
      {conversations.length === 0 && (
        <li className="px-4 py-8 text-sm font-light text-bone-muted lg:px-6">
          No sessions yet.
        </li>
      )}
      {conversations.map((c) => (
        <li key={c.id}>
          <Link
            href={`/advisor/${c.id}`}
            onClick={() => setOpen(false)}
            className={cn(
              "block px-4 py-4 border-b border-line transition-colors min-h-[56px] lg:px-6",
              c.id === activeId
                ? "bg-bone/[0.04] text-bone"
                : "hover:bg-bone/[0.02] text-bone-muted",
            )}
          >
            <div className="text-sm font-light line-clamp-2">
              {c.title ?? "Untitled"}
            </div>
            <div className="mt-1 text-[10px] tracking-[0.24em] uppercase text-bone/30">
              {new Date(c.updated_at).toLocaleDateString()}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col h-[calc(100dvh-3.5rem)] md:h-screen min-h-0">
      <div className="lg:hidden shrink-0 border-b border-line px-4 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="min-h-[44px] px-4 border border-line text-[10px] tracking-[0.24em] uppercase text-bone"
        >
          Sessions ({conversations.length})
        </button>
        <Button asChild size="sm" variant="outline" className="min-h-[44px]">
          <Link href="/advisor">New chat</Link>
        </Button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-ink-0/95 backdrop-blur-xl">
          <div className="flex h-full flex-col pt-safe pb-safe">
            <div className="flex items-center justify-between border-b border-line px-4 py-4">
              <span className="text-[10px] tracking-[0.28em] uppercase text-bone/40">
                Sessions
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-[44px] min-w-[44px] text-[10px] tracking-[0.24em] uppercase text-bone-muted"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{sessionList}</div>
            <div className="border-t border-line p-4">
              <Button asChild className="w-full min-h-[48px]" variant="outline">
                <Link href="/advisor" onClick={() => setOpen(false)}>
                  New chat
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid flex-1 min-h-0 grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:flex flex-col border-r border-line bg-black min-h-0">
          <div className="px-6 py-5 border-b border-line flex items-center justify-between shrink-0">
            <span className="text-[10px] tracking-[0.28em] uppercase text-bone/40">
              Sessions
            </span>
            <Button asChild size="sm" variant="outline">
              <Link href="/advisor">New</Link>
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">{sessionList}</div>
        </aside>
        <div className="min-h-0 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
