import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Comparison } from "@/components/landing/comparison";
import { Examples } from "@/components/landing/examples";
import { Faq } from "@/components/landing/faq";
import { Pricing } from "@/components/landing/pricing";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Comparison />
        <Examples />
        <Faq />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
