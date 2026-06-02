import Link from "next/link";
import { GridOverlay } from "@/components/ambient/grid-overlay";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <GridOverlay className="opacity-30" />
      <header className="relative z-10 border-b border-line">
        <div className="mx-auto max-w-7xl px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="inline-block h-2 w-2 bg-bone" />
            <span className="text-[11px] tracking-[0.32em] uppercase">
              Brain Mirror
            </span>
          </Link>
          <span className="text-[10px] tracking-[0.32em] uppercase text-bone/40">
            Cognitive Reconstruction Protocol
          </span>
        </div>
      </header>
      <main className="relative z-10 flex-1 flex">{children}</main>
    </div>
  );
}
