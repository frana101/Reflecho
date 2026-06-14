import type { Metadata, Viewport } from "next";
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
  title: "Reflecho — Stop guessing what to do next",
  description:
    "A personal advisor that learns how you think and gives advice based on you — not generic tips that weren't built for you.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    title: "Reflecho — Stop guessing what to do next",
    description:
      "A personal advisor that learns how you think and gives advice based on you.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
        <div className="relative z-[2]">{children}</div>
      </body>
    </html>
  );
}
