import { Nav } from "@/components/landing/nav";
import {
  Hero,
  AdvisorSection,
  WhyAdviceFails,
  WhatItDoes,
  BuiltForStuck,
  ClaritySection,
  FinalCta,
} from "@/components/landing/home-sections";
import { Footer } from "@/components/landing/footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <AdvisorSection />
        <WhyAdviceFails />
        <WhatItDoes />
        <BuiltForStuck />
        <ClaritySection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
