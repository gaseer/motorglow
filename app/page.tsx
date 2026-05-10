import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Packages } from "@/components/landing/Packages";
import { WhyMotorGlow } from "@/components/landing/WhyMotorGlow";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Packages />
      <WhyMotorGlow />
      <Footer />
    </main>
  );
}
