import { Nav } from "@/components/landing/nav";
import {
  Hero,
  AdviceProblem,
  HowItWorks,
  WhatYouGet,
  TriedEverything,
  FinalCta,
} from "@/components/landing/home-sections";
import { Footer } from "@/components/landing/footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <AdviceProblem />
        <HowItWorks />
        <WhatYouGet />
        <TriedEverything />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
