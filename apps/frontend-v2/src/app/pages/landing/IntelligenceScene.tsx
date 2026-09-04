import { useEffect, useRef, useState } from "react";
import { ClipboardList, Sparkles, Target, UserSearch, ArrowRight, Activity } from "lucide-react";

import sceneCrystal from "@/assets/scene-crystal.jpg";
import { useParallaxBackground } from "@/app/pages/landing/useParallaxBackground";
import { ensureGsapRegistered, gsap } from "@/app/pages/landing/gsapSetup";
import { AmbientFog } from "@/app/pages/landing/AmbientFog";

interface ConnectionItem {
  step: string;
  icon: typeof ClipboardList;
  label: string;
  desc: string;
  detail: string;
}

const CONNECTIONS: ConnectionItem[] = [
  {
    step: "01",
    icon: ClipboardList,
    label: "Campus Activity",
    desc: "Everything a student does, captured as it happens.",
    detail: "Workshops, hackathons, certifications, and coursework are verified in real time.",
  },
  {
    step: "02",
    icon: Sparkles,
    label: "Skills & Growth",
    desc: "Real experience building into a living skillset.",
    detail: "AI maps granular competencies, benchmarked against current industry demands.",
  },
  {
    step: "03",
    icon: Target,
    label: "Career Readiness",
    desc: "One transparent picture of where a student stands.",
    detail: "Objective readiness scores eliminate guesswork for placement teams and students.",
  },
  {
    step: "04",
    icon: UserSearch,
    label: "Talent Discovery",
    desc: "Recruiters discover the exact right fit, instantly.",
    detail: "Filter candidates by verified skills and demonstrable project achievements.",
  },
];

const TEXT_SHADOW = "0 2px 14px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.95)";

/**
 * Enhanced IntelligenceScene:
 * - Fits within the viewport window (h-screen / compact window-fit layout)
 * - Crystal artwork background clearly visible with minimal translucent overlay
 * - Compact, high-impact 2x2 interactive cards and synergy flow
 */
export function IntelligenceScene() {
  const bgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const connectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  useParallaxBackground(bgRef);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connections = connectionRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (prefersReduced || !sectionRef.current || connections.length === 0) return;

    ensureGsapRegistered();
    gsap.set([headRef.current, ...connections], { opacity: 0, y: 14 });
    gsap.set(flashRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
    });

    tl.to(flashRef.current, { opacity: 1, duration: 0.7, ease: "power1.out" })
      .to(flashRef.current, { opacity: 0, duration: 1.0, ease: "power1.in" }, ">-0.2")
      .to(headRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "<")
      .to(connections, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.1 }, "-=0.2");

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      id="intelligence"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-10 sm:py-12 sm:px-12"
    >
      {/* Crystal artwork background - positioned so the glowing crystal has ample breathing room */}
      <div
        ref={bgRef}
        className="absolute -inset-y-[6%] inset-x-0 rz-crystal-pulse bg-cover"
        style={{ backgroundImage: `url(${sceneCrystal})`, backgroundPosition: "22% center" }}
      />

      {/* Awakening light flash */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 700px 500px at 22% 45%, rgba(125,232,255,.35), transparent 65%)" }}
      />

      {/* Light translucent gradient so the crystal artwork breathes freely */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,6,10,0.3) 0%, transparent 15%, transparent 85%, rgba(5,6,10,0.45) 100%)",
        }}
      />
      <AmbientFog tint="rgba(79,227,212,.05)" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-6">
        {/* Left space allowing the glowing crystal in the artwork to shine through unobstructed */}
        <div className="hidden flex-1 lg:block" aria-hidden="true" />

        {/* Content column - compact and unconstrained */}
        <div className="w-full max-w-md rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(5,6,10,0.65)] p-5 sm:p-6 backdrop-blur-md shadow-2xl">
          <div ref={headRef}>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[rgba(125,232,255,0.3)] bg-[rgba(5,6,10,0.6)] px-3 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[var(--rz-eye)]">
              <Activity className="h-3 w-3 animate-pulse" aria-hidden="true" />
              <span>The RyuZen Intelligence Engine</span>
            </div>
            <h2 className="rz-display mb-1.5 text-2xl font-extrabold uppercase sm:text-3xl" style={{ color: "#E4EEF9", textShadow: TEXT_SHADOW }}>
              Everything connects.
            </h2>
            <p className="mb-4 text-xs sm:text-sm leading-relaxed text-[#D2DCE8]" style={{ textShadow: TEXT_SHADOW }}>
              Milestones synthesize into a unified graph — empowering students to advance and recruiters to discover genuine talent.
            </p>
          </div>

          {/* 2x2 Interactive Synergy Cards */}
          <div className="grid grid-cols-2 gap-3">
            {CONNECTIONS.map((c, i) => {
              const isActive = activeStep === i;

              return (
                <div
                  key={c.label}
                  ref={(el) => {
                    connectionRefs.current[i] = el;
                  }}
                  onClick={() => setActiveStep(i)}
                  className={`group relative cursor-pointer rounded-xl border p-3 backdrop-blur-md transition-all duration-200 ${
                    isActive
                      ? "border-[var(--rz-eye)] bg-[rgba(19,23,34,0.9)] shadow-[0_0_18px_rgba(125,232,255,0.25)]"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(5,6,10,0.55)] hover:border-[rgba(125,232,255,0.3)] hover:bg-[rgba(19,23,34,0.75)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-lg border text-[var(--rz-eye)]"
                      style={{
                        borderColor: isActive ? "var(--rz-eye)" : "rgba(255,255,255,0.12)",
                        background: isActive ? "rgba(125,232,255,0.15)" : "rgba(5,6,10,0.4)",
                      }}
                    >
                      <c.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="rz-mono text-[10px] font-bold text-[var(--rz-text-mute)] group-hover:text-[var(--rz-eye)]">
                      {c.step}
                    </span>
                  </div>

                  <p className="text-[12.5px] font-semibold text-[var(--rz-text)] group-hover:text-[var(--rz-eye)] transition-colors">
                    {c.label}
                  </p>
                  <p className="mt-0.5 text-[10.5px] leading-tight text-[var(--rz-text-dim)] line-clamp-2">
                    {c.desc}
                  </p>

                  {isActive && (
                    <p className="mt-2 border-t border-[rgba(125,232,255,0.15)] pt-1.5 text-[10px] leading-tight text-[var(--rz-crystal)]">
                      {c.detail}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive Synergy Chain Indicator */}
          <div className="mt-4 flex items-center justify-between rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(5,6,10,0.5)] px-3 py-2 text-[10.5px]">
            <span className="rz-mono uppercase tracking-wider text-[var(--rz-text-mute)] text-[9.5px]">
              Flow:
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-[var(--rz-text-dim)]">
              <span className={activeStep === 0 ? "text-[var(--rz-eye)] font-bold" : ""}>Activity</span>
              <ArrowRight className="h-2.5 w-2.5 opacity-40" />
              <span className={activeStep === 1 ? "text-[var(--rz-eye)] font-bold" : ""}>Skills</span>
              <ArrowRight className="h-2.5 w-2.5 opacity-40" />
              <span className={activeStep === 2 ? "text-[var(--rz-eye)] font-bold" : ""}>Readiness</span>
              <ArrowRight className="h-2.5 w-2.5 opacity-40" />
              <span className={activeStep === 3 ? "text-[var(--rz-eye)] font-bold" : ""}>Talent</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
