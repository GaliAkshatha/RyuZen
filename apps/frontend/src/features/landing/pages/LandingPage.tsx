import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { FeaturesSection } from "../components/FeaturesSection";
import { AISection } from "../components/AISection";
import { GamificationSection } from "../components/GamificationSection";
import { CareerSection } from "../components/CareerSection";
import { PlacementsSection } from "../components/PlacementsSection";
import { OrganizationsSection } from "../components/OrganizationsSection";
import { PreviewSection } from "../components/PreviewSection";
import { FAQSection } from "../components/FAQSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";
import { SectionDivider } from "../components/SectionDivider";

/**
 * The opening chapter of RyuZen, not a generic marketing page — every
 * section reuses the same atmosphere system, glow-card language, and
 * even the exact LevelProgressRing component that power the real,
 * authenticated app. A visitor scrolling here and a Student on their
 * Dashboard five minutes later should feel like they're in the same
 * world, not two different products stitched together.
 *
 * Deliberate story arc: discover RyuZen (Hero) -> understand the world
 * (Features) -> see the AI (AI, alternating showcase) -> see
 * progression (Gamification, the cinematic beat) -> see the career
 * path (Career/Placements, timelines) -> see it for institutions
 * (Organizations) -> imagine yourself using it (Preview) -> answers
 * (FAQ) -> join (Contact). SectionDividers thread consecutive sections
 * together so the page reads as one continuous descent, not
 * independently stacked blocks.
 */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        <Hero />
        <FeaturesSection />
        <SectionDivider />
        <AISection />
        <GamificationSection />
        <SectionDivider />
        <CareerSection />
        <PlacementsSection />
        <SectionDivider />
        <OrganizationsSection />
        <PreviewSection />
        <SectionDivider />
        <FAQSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
