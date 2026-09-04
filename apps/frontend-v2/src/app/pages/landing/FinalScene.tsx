import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

import sceneFinalTraveler from "@/assets/scene-final-traveler.jpg";
import { useParallaxBackground } from "@/app/pages/landing/useParallaxBackground";
import { ensureGsapRegistered, gsap } from "@/app/pages/landing/gsapSetup";

const TEXT_SHADOW = "0 2px 14px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.95)";

/**
 * Enhanced FinalScene:
 * - Traveler and moon artwork clearly visible with minimal gradient overlay
 * - Serene, cinematic mood with high-clarity action buttons
 * - Role quick-start launcher
 */
export function FinalScene() {
  const bgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useParallaxBackground(bgRef, 3);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current || !contentRef.current) return;

    ensureGsapRegistered();
    gsap.set(contentRef.current, { opacity: 0, y: 12 });

    const tween = gsap.to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power1.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 65%", once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center overflow-hidden px-6 py-12 sm:py-16 sm:px-14">
      {/* Artwork background - clearly visible */}
      <div
        ref={bgRef}
        className="absolute -inset-y-[6%] inset-x-0 bg-cover"
        style={{ backgroundImage: `url(${sceneFinalTraveler})`, backgroundPosition: "68% center" }}
      />

      {/* Light minimal overlay so the traveler, mountains and moon are clearly seen */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,6,10,0.4) 0%, transparent 15%, transparent 80%, rgba(5,6,10,0.7) 100%)",
        }}
      />

      {/* Soft left aura for text contrast */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-1/2"
        style={{
          background: "radial-gradient(ellipse 600px 500px at 15% 50%, rgba(5,6,10,0.75), transparent 75%)",
        }}
      />

      {/* Content in the negative space on the left */}
      <div ref={contentRef} className="relative z-10 max-w-lg text-left">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(125,232,255,0.35)] bg-[rgba(5,6,10,0.65)] px-3 py-0.5 text-[10.5px] uppercase tracking-[0.14em] text-[var(--rz-eye)] backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-[var(--rz-crystal)]" aria-hidden="true" />
          <span>The Journey Begins Now</span>
        </div>

        <h2 className="rz-display mb-3 text-3xl font-extrabold uppercase leading-tight sm:text-5xl" style={{ color: "#F4EFE4", textShadow: TEXT_SHADOW }}>
          Build what
          <br />
          comes next.
        </h2>

        <p className="mb-7 text-xs sm:text-sm leading-relaxed text-[#D2DCE8]" style={{ textShadow: TEXT_SHADOW }}>
          Whether you are building your career, elevating campus outcomes, or searching for transformative talent,
          RyuZen weaves the threads of experience into unified success.
        </p>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap items-center gap-3.5">
          <Link
            to="/login"
            className="group flex items-center gap-2 rounded-lg px-7 py-3 text-[13px] font-bold uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(125,232,255,0.5)]"
            style={{ background: "var(--rz-eye)", color: "#04262e" }}
          >
            <span>Enter RyuZen</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/learn-more"
            className="rounded-lg border border-[rgba(255,255,255,0.15)] bg-[rgba(5,6,10,0.6)] px-6 py-3 text-[13px] font-semibold uppercase tracking-wider text-[var(--rz-text)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--rz-eye)] hover:text-[var(--rz-eye)]"
          >
            Learn more
          </Link>
        </div>

        {/* Role Quick Selection Helper */}
        <div className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(5,6,10,0.65)] p-4 backdrop-blur-md">
          <p className="rz-mono mb-2 text-[10px] uppercase tracking-wider text-[var(--rz-text-mute)]">
            Explore Your Role Immediately:
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <a
              href="#explore"
              className="rounded-md border border-[rgba(92,225,230,0.3)] bg-[rgba(92,225,230,0.08)] px-2.5 py-1 text-[#5ce1e6] hover:bg-[rgba(92,225,230,0.18)] transition-colors"
            >
              Student Portal →
            </a>
            <a
              href="#explore"
              className="rounded-md border border-[rgba(246,196,102,0.3)] bg-[rgba(246,196,102,0.08)] px-2.5 py-1 text-[#f6c466] hover:bg-[rgba(246,196,102,0.18)] transition-colors"
            >
              Campus Admin →
            </a>
            <a
              href="#explore"
              className="rounded-md border border-[rgba(190,138,255,0.3)] bg-[rgba(190,138,255,0.08)] px-2.5 py-1 text-[#be8aff] hover:bg-[rgba(190,138,255,0.18)] transition-colors"
            >
              Recruiter Hub →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
