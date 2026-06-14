"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAV_ITEMS, isNavActive } from "@/lib/nav-items";
import { cn } from "@/lib/utils";

export function Sidebar({ displayName }: { displayName: string }) {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-64 shrink-0 border-r border-line bg-black flex-col">
      <div className="px-6 py-6 border-b border-line">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 bg-bone" />
          <span className="text-[11px] tracking-[0.32em] uppercase">
            Reflecho
          </span>
        </Link>
      </div>

      <div className="px-6 py-6 border-b border-line">
        <div className="text-[10px] tracking-[0.32em] uppercase text-bone-muted">
          Subject
        </div>
        <div className="mt-2 text-base font-medium tracking-tight truncate">
          {displayName}
        </div>
      </div>

      <nav className="flex-1 py-4">
        {APP_NAV_ITEMS.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-6 py-3 text-[12px] tracking-[0.24em] uppercase transition-colors border-l-2 min-h-[44px]",
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
          className="text-[10px] tracking-[0.32em] uppercase text-bone/40 hover:text-bone transition-colors min-h-[44px]"
        >
          Sign Out
        </button>
      </form>
    </aside>
  );
}
