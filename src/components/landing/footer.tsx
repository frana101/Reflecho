import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative">
      <div className="mx-auto max-w-3xl px-4 sm:px-8 py-12 sm:py-16 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-10">
        <div>
          <Link href="/" className="text-base font-medium">
            Reflechto
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-snug text-bone">
            A personal advisor that learns how you think and gives advice based
            on you.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <Link href="/auth/sign-in" className="text-bone-muted hover:text-bone">
            Sign in
          </Link>
          <Link
            href="/auth/sign-up?next=/onboarding"
            className="text-bone-muted hover:text-bone"
          >
            Get Started
          </Link>
          <Link href="/legal/privacy" className="text-bone-muted hover:text-bone">
            Privacy
          </Link>
        </div>
      </div>
      <div className="border-t border-line py-6">
        <div className="mx-auto max-w-3xl px-4 sm:px-8 text-xs text-bone-muted pb-safe">
          © {new Date().getFullYear()} Reflechto
        </div>
      </div>
    </footer>
  );
}
