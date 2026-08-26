import { useRef } from "react";
import { ShieldOff } from "lucide-react";

import sceneDemoCity from "@/assets/scene-demo-city.jpg";
import { useParallaxBackground } from "@/app/pages/landing/useParallaxBackground";
import { DemoCarousel } from "@/app/pages/landing/DemoCarousel";

/**
 * The one dedicated demo section on the whole page. Left: real
 * descriptive copy. Right: DemoCarousel, a real circular carousel of
 * all 6 real seeded roles (not the 3-card row this used to be) -
 * every click still goes through the exact real login() flow (see
 * useDemoLogin), so "no sign-in required" is genuinely true from the
 * visitor's perspective while nothing about authentication is faked.
 */
export function DemoScene() {
  const bgRef = useRef<HTMLDivElement>(null);
  useParallaxBackground(bgRef);

  return (
    <section id="explore" className="relative overflow-hidden px-6 py-24 sm:px-12" style={{ minHeight: "78vh" }}>
      <div ref={bgRef} className="absolute -inset-y-[6%] inset-x-0 bg-cover bg-center" style={{ backgroundImage: `url(${sceneDemoCity})` }} />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, var(--rz-void) 0%, rgba(5,6,10,.35) 16%, rgba(5,6,10,.55) 60%, var(--rz-void) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="rz-mono mb-3 text-[11px] uppercase tracking-[0.14em] text-[var(--rz-eye)]">Explore RyuZen</p>
          <h2 className="rz-display mb-4 text-3xl font-bold uppercase sm:text-4xl" style={{ color: "#DCE4EF" }}>
            See RyuZen in action.
          </h2>
          <p className="mb-6 max-w-sm text-sm leading-relaxed text-[var(--rz-text-dim)]">
            Step into RyuZen through sample accounts and experience the platform as a student, organization, or
            recruiter.
          </p>
          <p className="rz-mono flex items-center gap-2 text-[10.5px] uppercase tracking-[0.1em] text-[var(--rz-crystal)]">
            <ShieldOff className="h-3.5 w-3.5" aria-hidden="true" />
            No sign-in required
          </p>
        </div>

        <DemoCarousel />
      </div>
    </section>
  );
}
