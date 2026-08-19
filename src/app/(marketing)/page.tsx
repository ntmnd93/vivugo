import { Hero } from "@/components/marketing/hero";
import { DestinationShowcase } from "@/components/marketing/destination-showcase";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { CtaSection } from "@/components/marketing/cta-section";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <DestinationShowcase />
      <HowItWorks />
      <FeatureGrid />
      <CtaSection />
    </>
  );
}
