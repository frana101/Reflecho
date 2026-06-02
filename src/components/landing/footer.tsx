import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-2">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 bg-bone" />
            <span className="text-[11px] tracking-[0.32em] uppercase">
              Brain Mirror
            </span>
          </Link>
          <p className="mt-6 max-w-md text-sm leading-relaxed font-light text-bone-muted">
            An evolving AI cognitive system. Continuous psychological modeling
            for those who want to understand themselves with surgical clarity.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <span className="text-mono-track text-[10px] text-bone/30 mb-2">
            System
          </span>
          <Link href="#protocol" className="text-bone-muted hover:text-bone">
            Protocol
          </Link>
          <Link href="#system" className="text-bone-muted hover:text-bone">
            Architecture
          </Link>
          <Link href="#pricing" className="text-bone-muted hover:text-bone">
            Access
          </Link>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <span className="text-mono-track text-[10px] text-bone/30 mb-2">
            Account
          </span>
          <Link href="/auth/sign-in" className="text-bone-muted hover:text-bone">
            Sign In
          </Link>
          <Link href="/auth/sign-up" className="text-bone-muted hover:text-bone">
            Begin
          </Link>
          <Link href="/legal/privacy" className="text-bone-muted hover:text-bone">
            Privacy
          </Link>
        </div>
      </div>
      <div className="border-t border-line py-6">
        <div className="mx-auto max-w-7xl px-8 flex items-center justify-between text-[10px] tracking-[0.32em] uppercase text-bone/30">
          <span>© Brain Mirror — Cognitive Systems</span>
          <span>Built for those who want to see themselves clearly.</span>
        </div>
      </div>
    </footer>
  );
}
