import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Footer } from "../components/Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      <Header />

      <main>
        <Hero />
      </main>

      <Footer />

    </div>
  );
}