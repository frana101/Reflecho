import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Grain } from "@/components/ambient/grain";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Brain Mirror — Cognitive Reconstruction System",
  description:
    "An evolving AI system that reconstructs how you think. A psychological mirror, not a chatbot.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    title: "Brain Mirror",
    description: "An evolving AI system that reconstructs how you think.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        inter.variable,
        mono.variable,
        "dark scroll-smooth antialiased",
      )}
      style={{ ["--font-geist" as string]: "var(--font-inter)" }}
    >
      <body className="min-h-screen bg-ink-0 text-bone selection:bg-bone selection:text-ink-0">
        <Grain />
        <div className="pointer-events-none fixed inset-0 z-[1] vignette" />
        <div className="relative z-[2]">{children}</div>
      </body>
    </html>
  );
}
