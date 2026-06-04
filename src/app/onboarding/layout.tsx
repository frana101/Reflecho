import Link from "next/link";
import { GridOverlay } from "@/components/ambient/grid-overlay";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <GridOverlay className="opacity-30" />
      <header className="relative z-10 border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 group shrink-0 min-w-0">
            <span className="inline-block h-2 w-2 bg-bone shrink-0" />
            <span className="text-[10px] sm:text-[11px] tracking-[0.22em] sm:tracking-[0.28em] uppercase truncate">
              Reflecho
            </span>
          </Link>
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline text-[10px] tracking-[0.24em] uppercase text-bone/40 truncate max-w-[200px]">
              Operating system analysis
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="relative z-10 flex-1 flex">{children}</main>
    </div>
  );
}
