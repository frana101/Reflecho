import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Sections } from "@/components/landing/sections";
import { SystemLayers } from "@/components/landing/system";
import { Pricing } from "@/components/landing/pricing";
import { Transmission } from "@/components/landing/transmission";
import { Footer } from "@/components/landing/footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Sections />
        <SystemLayers />
        <Pricing />
        <Transmission />
      </main>
      <Footer />
    </>
  );
}
