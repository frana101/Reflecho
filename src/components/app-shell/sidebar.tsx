"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  code: string;
}

const ITEMS: NavItem[] = [
  { code: "00", label: "Overview", href: "/app" },
  { code: "01", label: "Dossier", href: "/dossier" },
  { code: "02", label: "Mirror", href: "/mirror" },
  { code: "03", label: "Memory", href: "/app/memory" },
  { code: "04", label: "Account", href: "/app/account" },
];

export function Sidebar({ displayName }: { displayName: string }) {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-64 shrink-0 border-r border-line bg-ink-50/40 flex-col">
      <div className="px-6 py-6 border-b border-line">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 bg-bone" />
          <span className="text-[11px] tracking-[0.32em] uppercase">
            Brain Mirror
          </span>
        </Link>
      </div>

      <div className="px-6 py-6 border-b border-line">
        <div className="text-[10px] tracking-[0.32em] uppercase text-bone/40">
          Subject
        </div>
        <div className="mt-2 text-base font-light tracking-tight">
          {displayName}
        </div>
      </div>

      <nav className="flex-1 py-4">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/app" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-6 py-3 text-[12px] tracking-[0.24em] uppercase transition-colors border-l-2",
                active
                  ? "text-bone border-bone bg-bone/[0.04]"
                  : "text-bone-muted border-transparent hover:text-bone hover:bg-bone/[0.02]",
              )}
            >
              <span className="text-[10px] text-bone/30">{item.code}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <form action="/auth/sign-out" method="post" className="px-6 py-6 border-t border-line">
        <button
          type="submit"
          className="text-[10px] tracking-[0.32em] uppercase text-bone/40 hover:text-bone transition-colors"
        >
          Sign Out
        </button>
      </form>
    </aside>
  );
}
