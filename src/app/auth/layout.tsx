import Link from "next/link";
import { GridOverlay } from "@/components/ambient/grid-overlay";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <GridOverlay className="opacity-50" />
      <header className="relative z-10 border-b border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <span className="inline-block h-2 w-2 bg-bone" />
            <span className="text-[11px] tracking-[0.28em] uppercase">
              Reflecho
            </span>
          </Link>
          <span className="hidden sm:inline text-[10px] tracking-[0.24em] uppercase text-bone/40">
            Secure Gateway
          </span>
        </div>
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 pb-safe">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
