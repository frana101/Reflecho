import Link from "next/link";

export const metadata = { title: "Privacy - Reflecho" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-8 py-20 max-w-3xl mx-auto">
      <Link
        href="/"
        className="text-[10px] tracking-[0.32em] uppercase text-bone/40 hover:text-bone"
      >
        Back
      </Link>
      <h1 className="mt-10 text-display-lg font-light tracking-tight">
        Privacy.
      </h1>
      <p className="mt-8 text-bone-muted font-light leading-relaxed">
        Reflecho processes deeply personal data. We treat it as such. Your
        answers, dossier, conversations, and memory cells are stored encrypted
        at rest, accessible only to your account, and never shared with third
        parties for advertising. You may export or delete everything at any
        time from your account page.
      </p>
      <p className="mt-6 text-bone-muted font-light leading-relaxed">
        We use OpenAI to synthesize your dossier and run the mirror. Per their
        API policy, your inputs are not used to train their public models. You
        are responsible for what you choose to share with the mirror.
      </p>
    </div>
  );
}
