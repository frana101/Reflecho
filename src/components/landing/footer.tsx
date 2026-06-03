import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div className="sm:col-span-2">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 bg-bone" />
            <span className="text-[11px] tracking-[0.28em] uppercase">
              Reflecho
            </span>
          </Link>
          <p className="mt-6 max-w-md text-sm leading-relaxed font-light text-bone-muted">
            Behavioral operating system analysis. Reverse-engineer how you
            decide, protect, and execute — then talk to a mirror built on that
            model.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <span className="text-[10px] tracking-[0.24em] uppercase text-bone/30 mb-1">
            Product
          </span>
          <Link href="#protocol" className="text-bone-muted hover:text-bone min-h-[36px] flex items-center">
            Protocol
          </Link>
          <Link href="#system" className="text-bone-muted hover:text-bone min-h-[36px] flex items-center">
            Output
          </Link>
          <Link href="#pricing" className="text-bone-muted hover:text-bone min-h-[36px] flex items-center">
            Access
          </Link>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <span className="text-[10px] tracking-[0.24em] uppercase text-bone/30 mb-1">
            Account
          </span>
          <Link href="/auth/sign-in" className="text-bone-muted hover:text-bone min-h-[36px] flex items-center">
            Sign In
          </Link>
          <Link href="/auth/sign-up" className="text-bone-muted hover:text-bone min-h-[36px] flex items-center">
            Begin
          </Link>
          <Link href="/legal/privacy" className="text-bone-muted hover:text-bone min-h-[36px] flex items-center">
            Privacy
          </Link>
        </div>
      </div>
      <div className="border-t border-line py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[10px] tracking-[0.2em] uppercase text-bone/30 pb-safe">
          <span>© Reflecho</span>
          <span className="text-balance normal-case tracking-normal text-bone/40 text-xs sm:text-[10px] sm:tracking-[0.2em] sm:uppercase">
            Not a personality test. An operating system read.
          </span>
        </div>
      </div>
    </footer>
  );
}
