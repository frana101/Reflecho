"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAV_ITEMS, isNavActive } from "@/lib/nav-items";
import { cn } from "@/lib/utils";

export function MobileNav({ displayName }: { displayName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const current =
    APP_NAV_ITEMS.find((item) => isNavActive(pathname, item.href))?.label ??
    "Reflecho";

  return (
    <>
      <header className="md:hidden fixed inset-x-0 top-0 z-40 h-14 border-b border-line bg-black/95 backdrop-blur-xl pb-safe">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/app" className="flex items-center gap-2 min-w-0">
            <span className="inline-block h-2 w-2 bg-bone shrink-0" />
            <span className="text-[10px] tracking-[0.22em] uppercase truncate">
              Reflecho
              <span className="text-bone/40 normal-case tracking-normal">
                {" "}
                / {current}
              </span>
            </span>
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center border border-line text-bone"
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span
                className={cn(
                  "block h-px w-5 bg-bone transition-transform",
                  open && "translate-y-[7px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-px w-5 bg-bone transition-opacity",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "block h-px w-5 bg-bone transition-transform",
                  open && "-translate-y-[7px] -rotate-45",
                )}
              />
            </div>
          </button>
        </div>
      </header>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-ink-0/95 backdrop-blur-xl pt-14 pb-safe"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-line px-4 py-5">
              <div className="text-[10px] tracking-[0.28em] uppercase text-bone/40">
                Subject
              </div>
              <div className="mt-1 text-lg font-light tracking-tight truncate">
                {displayName}
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-2">
              {APP_NAV_ITEMS.map((item) => {
                const active = isNavActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-4 text-[12px] tracking-[0.24em] uppercase border-l-2 min-h-[52px]",
                      active
                        ? "text-bone border-bone bg-bone/[0.04]"
                        : "text-bone-muted border-transparent",
                    )}
                  >
                    <span className="text-[10px] text-bone/30">{item.code}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <form action="/auth/sign-out" method="post" className="border-t border-line p-4">
              <button
                type="submit"
                className="w-full min-h-[48px] text-[10px] tracking-[0.28em] uppercase text-bone/40 hover:text-bone"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
