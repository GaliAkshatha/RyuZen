import { useRef } from "react";
import { ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";

import sceneDemoCity from "@/assets/scene-demo-city.jpg";
import { useParallaxBackground } from "@/app/pages/landing/useParallaxBackground";
import { DemoCarousel } from "@/app/pages/landing/DemoCarousel";
import { AmbientFog } from "@/app/pages/landing/AmbientFog";

const TEXT_SHADOW = "0 2px 14px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.95)";

/**
 * Enhanced DemoScene:
 * - Words pushed towards the full left side
 * - Background city visual clearly visible with minimal overlay
 * - Right side houses the interactive circular carousel
 */
export function DemoScene() {
  const bgRef = useRef<HTMLDivElement>(null);
  useParallaxBackground(bgRef);

  return (
    <section id="explore" className="relative min-h-[88vh] flex items-center overflow-hidden px-6 py-20 sm:px-12 lg:px-16">
      {/* City artwork background - clearly visible */}
      <div
        ref={bgRef}
        className="absolute -inset-y-[6%] inset-x-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${sceneDemoCity})`, backgroundPosition: "center 35%" }}
      />

      {/* Light minimal overlay so city lights and architecture are vividly seen */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,6,10,0.35) 0%, transparent 20%, transparent 75%, rgba(5,6,10,0.6) 100%)",
        }}
      />

      {/* Localized soft dark aura on the left to guarantee 100% crisp legibility */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-1/2"
        style={{
          background: "radial-gradient(ellipse 650px 550px at 15% 50%, rgba(5,6,10,0.78), transparent 75%)",
        }}
      />

      <AmbientFog tint="rgba(125,232,255,.04)" />

      {/* Grid aligned to the left */}
      <div className="relative z-10 w-full grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Words pushed to the left side full */}
        <div className="text-left max-w-md">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(125,232,255,0.35)] bg-[rgba(5,6,10,0.65)] px-3 py-0.5 text-[10.5px] uppercase tracking-[0.14em] text-[var(--rz-eye)] backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[var(--rz-crystal)]" aria-hidden="true" />
            <span>Interactive Sandbox</span>
          </div>

          <h2 className="rz-display mb-3 text-3xl font-extrabold uppercase sm:text-5xl" style={{ color: "#F0F4FA", textShadow: TEXT_SHADOW }}>
            See RyuZen
            <br />
            in action.
          </h2>

          <p className="mb-6 text-xs sm:text-sm leading-relaxed text-[#D2DCE8]" style={{ textShadow: TEXT_SHADOW }}>
            Step directly into authentic live portals using pre-populated accounts.
            Experience the platform as a student, organization administrator, or corporate recruiter.
          </p>

          {/* Feature checklist */}
          <div className="mb-6 space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs text-[#E4ECF7]" style={{ textShadow: TEXT_SHADOW }}>
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--rz-crystal)] shrink-0" />
              <span>Full functionality enabled — explore verified student and org data</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#E4ECF7]" style={{ textShadow: TEXT_SHADOW }}>
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--rz-crystal)] shrink-0" />
              <span>6 institutional roles: Students, Admins, Faculty, Alumni, and Recruiters</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#E4ECF7]" style={{ textShadow: TEXT_SHADOW }}>
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--rz-crystal)] shrink-0" />
              <span>Zero sign-in or setup required — single click live launch</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-lg border border-[rgba(79,227,212,0.3)] bg-[rgba(5,6,10,0.7)] px-3.5 py-2 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--rz-crystal)]" aria-hidden="true" />
            <span className="rz-mono text-[10px] font-medium tracking-wide uppercase text-[var(--rz-crystal)]">
              No Sign-in Required · Exit Anytime
            </span>
          </div>
        </div>

        {/* Carousel on the right side */}
        <div className="w-full flex justify-center lg:justify-end">
          <DemoCarousel />
        </div>
      </div>
    </section>
  );
}
