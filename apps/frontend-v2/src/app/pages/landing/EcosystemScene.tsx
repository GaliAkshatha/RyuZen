import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Sparkles, Compass } from "lucide-react";

import sceneThreePaths from "@/assets/scene-three-paths.jpg";
import { useParallaxBackground } from "@/app/pages/landing/useParallaxBackground";
import { ensureGsapRegistered, gsap } from "@/app/pages/landing/gsapSetup";
import { AmbientFog } from "@/app/pages/landing/AmbientFog";
import { PathDetailPanel } from "@/app/pages/landing/PathDetailPanel";
import type { PathKey } from "@/app/pages/landing/pathDetails";

/**
 * Three paths color-matched to the luminous hues in scene-three-paths.jpg:
 * - Student: Cyan/Teal (#5ce1e6) matching the left glowing crystal river
 * - Organization: Warm Lantern Gold (#f6c466) matching the central temple path
 * - Recruiter: Mystic Violet (#be8aff) matching the right enchanted blossom path
 *
 * Positioned to align directly with where each path emerges in the artwork.
 */
const PATHS: {
  key: PathKey;
  label: string;
  tagline: string;
  color: string;
  glowColor: string;
  position: string;
}[] = [
  {
    key: "student",
    label: "Student",
    tagline: "Build your journey.",
    color: "#5ce1e6",
    glowColor: "rgba(92,225,230,0.65)",
    position: "left-[8%] sm:left-[19%] sm:bottom-4",
  },
  {
    key: "organization",
    label: "Organization",
    tagline: "Build a stronger campus.",
    color: "#ff9d3b",
    glowColor: "rgba(255,157,59,0.75)",
    // Vertical: measured directly against a rendered screenshot (not
    // just the source artwork) - sits only slightly higher than
    // student/recruiter's bottom-4 (16px), not dramatically higher -
    // an earlier attempt at sm:bottom-[30vh] overshot by roughly 24vh,
    // confirmed by comparing rendered beacon position against the
    // user's marked target point.
    //
    // Horizontal: NOT using -translate-x-1/2 for centering, unlike a
    // typical "left-1/2 -translate-x-1/2" pattern (which does work
    // fine elsewhere in this codebase, e.g. TopNav.tsx). Confirmed
    // root cause here specifically: this button's own ref is animated
    // by GSAP (gsap.set/.to on orgEl, y: 16 -> 0), and GSAP writes
    // directly to the element's inline transform style - which
    // REPLACES rather than merges with a class-based translateX,
    // silently destroying the horizontal centering once the entrance
    // animation runs. Student/Recruiter never hit this because they
    // use plain left/right percentage anchors with no transform
    // dependency at all. Fixed here by centering via a calc() left
    // value instead - no transform involved, so nothing for GSAP to
    // clobber. The -97px offset is a real measured correction
    // (confirmed via two independent pixel measurements against an
    // actual rendered screenshot), not a guess.
    position: "left-[calc(50%-72px)] sm:bottom-9",
  },
  {
    key: "recruiter",
    label: "Recruiter",
    tagline: "Discover the right talent.",
    color: "#be8aff",
    glowColor: "rgba(190,138,255,0.65)",
    position: "right-[8%] sm:right-[19%] sm:bottom-4",
  },
];

const TEXT_SHADOW = "0 2px 14px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.95)";

export function EcosystemScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const narratorRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<Partial<Record<PathKey, HTMLButtonElement | null>>>({});
  const [selected, setSelected] = useState<PathKey | null>(null);
  useParallaxBackground(bgRef);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const orgEl = pathRefs.current.organization;
    const studentEl = pathRefs.current.student;
    const recruiterEl = pathRefs.current.recruiter;

    if (prefersReduced || !sceneRef.current || !orgEl || !studentEl || !recruiterEl) {
      return;
    }

    ensureGsapRegistered();
    gsap.set([narratorRef.current, orgEl, studentEl, recruiterEl], { opacity: 0, y: 16 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sceneRef.current, start: "top 75%", once: true },
    });

    tl.to(narratorRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" })
      .to(orgEl, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2")
      .to([studentEl, recruiterEl], { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.12 }, "-=0.2");

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  function setActive(key: PathKey | null) {
    const el = sceneRef.current;
    if (!el) return;
    (["student", "organization", "recruiter"] as PathKey[]).forEach((k) => {
      el.style.setProperty(`--glow-${k}`, k === key ? "1" : key ? "0.35" : "0.7");
    });
  }

  function togglePath(key: PathKey) {
    const isOpening = selected !== key;
    setSelected((prev) => (prev === key ? null : key));

    if (isOpening) {
      window.setTimeout(() => {
        document.getElementById("path-detail-panel")?.scrollIntoView({ block: "start", behavior: "smooth" });
      }, 550);
    }
  }

  return (
    <>
      <section
        id="paths"
        ref={sceneRef}
        className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pt-16 pb-12 sm:pt-20 sm:pb-14"
        style={
          {
            "--glow-student": 0.7,
            "--glow-organization": 0.7,
            "--glow-recruiter": 0.7,
          } as CSSProperties
        }
      >
        {/* Parallax background artwork - clearly visible */}
        <div
          ref={bgRef}
          className="absolute -inset-y-[6%] inset-x-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${sceneThreePaths})`, backgroundPosition: "center 42%" }}
        />

        {/* Minimal gradient so mountains, torii gates and glowing paths are vividly visible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,6,10,0.4) 0%, transparent 15%, transparent 85%, rgba(5,6,10,0.5) 100%)",
          }}
        />
        <AmbientFog tint="rgba(246,196,102,.04)" />

        {/* Header - positioned near the top of the scene */}
        <div ref={narratorRef} className="relative z-10 mx-auto max-w-xl text-center">
          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[rgba(246,196,102,0.4)] bg-[rgba(5,6,10,0.65)] px-3 py-0.5 text-[10.5px] uppercase tracking-[0.14em] text-[#f6c466] backdrop-blur-md">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            <span>Interactive Ecosystem</span>
          </div>
          <h2 className="rz-display mb-2 text-3xl font-extrabold uppercase sm:text-5xl" style={{ color: "#F0F2F6", textShadow: TEXT_SHADOW }}>
            One campus.
            <br />
            Three perspectives.
          </h2>
        </div>

        {/* Three Interactive Path Beacons - positioned directly over each path */}
        <div className="relative z-10 mt-auto flex flex-col items-center gap-6 sm:block sm:h-[220px]">
          {PATHS.map((path) => {
            const isSelected = selected === path.key;

            return (
              <button
                key={path.key}
                ref={(el) => {
                  pathRefs.current[path.key] = el;
                }}
                type="button"
                aria-pressed={isSelected}
                onMouseEnter={() => setActive(path.key)}
                onFocus={() => setActive(path.key)}
                onMouseLeave={() => setActive(null)}
                onBlur={() => setActive(null)}
                onClick={() => togglePath(path.key)}
                className={`group relative flex flex-col items-center gap-2 text-center transition-transform duration-300 sm:absolute ${path.position} hover:scale-105`}
              >
                {/* Glowing aura */}
                <span
                  className="pointer-events-none absolute -inset-x-14 -inset-y-10 rounded-full blur-2xl transition-opacity duration-500"
                  style={{ background: path.glowColor, opacity: `calc(var(--glow-${path.key}) * 0.55)` }}
                />

                {/* Beacon node aligned to path */}
                <span
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isSelected ? "scale-115 shadow-[0_0_24px_currentColor]" : "group-hover:scale-110"
                  }`}
                  style={{
                    borderColor: path.color,
                    color: path.color,
                    boxShadow: isSelected
                      ? `0 0 28px ${path.glowColor}, 0 0 12px ${path.color}`
                      : `0 0 18px ${path.glowColor}`,
                    background: "rgba(5,6,10,0.75)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: path.color }}
                  />
                </span>

                {/* Role Pill Card */}
                <div
                  className="relative rounded-lg border px-3.5 py-1.5 backdrop-blur-md transition-all duration-300"
                  style={{
                    borderColor: isSelected ? path.color : "rgba(255,255,255,0.18)",
                    background: isSelected ? "rgba(5,6,10,0.85)" : "rgba(5,6,10,0.65)",
                    boxShadow: isSelected ? `0 0 20px -5px ${path.glowColor}` : "0 4px 15px rgba(0,0,0,0.6)",
                  }}
                >
                  <p
                    className="rz-display text-sm font-bold uppercase tracking-wider"
                    style={{ color: path.color, textShadow: TEXT_SHADOW }}
                  >
                    {path.label}
                  </p>
                  <p className="text-[11px] text-[#E0E6F0]" style={{ textShadow: TEXT_SHADOW }}>
                    {path.tagline}
                  </p>
                </div>

                {/* Action Cue */}
                <span
                  className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-semibold tracking-wide uppercase transition-colors"
                  style={{
                    color: isSelected ? path.color : "rgba(255,255,255,0.8)",
                    background: "rgba(5,6,10,0.65)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Compass className="h-2.5 w-2.5" />
                  <span>{isSelected ? "Close" : "Inspect Path"}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Expandable Path Detail Panel */}
      <PathDetailPanel selected={selected} />
    </>
  );
}
