import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ArrowRight, Sparkles, Compass } from "lucide-react";

import dragonWorld from "@/assets/dragon-world.jpg";
import { AmbientFog } from "@/app/pages/landing/AmbientFog";

/**
 * Enhanced HeroExperience:
 * - Reduced delay: words start appearing rapidly within 0.25s for immediate responsiveness
 * - Crystal-clear background visual: minimal gradient overlay so the dragon world artwork is clearly visible
 * - Tightened bottom spacing to seamlessly flow into the Ecosystem section without an awkward gap
 * - High-contrast text shadows ensuring readability over the vibrant artwork
 */
export function HeroExperience({ onNavReveal, skipIntro = false }: { onNavReveal: () => void; skipIntro?: boolean }) {
  const heroBgRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLAnchorElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (reducedMotion || !spotlightRef.current) return;
    const { clientX, clientY } = e;
    spotlightRef.current.style.background = `radial-gradient(650px circle at ${clientX}px ${clientY}px, rgba(125,232,255,0.12), transparent 70%)`;
  }

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = [
      badgeRef.current,
      wordmarkRef.current,
      line1Ref.current,
      line2Ref.current,
      subRef.current,
      ctaRef.current,
      ribbonRef.current,
      scrollCueRef.current,
    ];

    if (prefersReduced || skipIntro) {
      setReducedMotion(true);
      onNavReveal();
      gsap.set(heroBgRef.current, { opacity: 1 });
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ delay: 0.05 });

    // Background fades in quickly
    tl.to(heroBgRef.current, { opacity: 1, duration: 0.6, ease: "power1.out" })
      .call(onNavReveal, [], 0.25)
      // Words start appearing rapidly within 0.25s
      .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.25)
      .to(wordmarkRef.current, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.35)
      .to(line1Ref.current, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.48)
      .to(line2Ref.current, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.6)
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.75)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.9)
      .to(ribbonRef.current, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 1.05)
      .to(scrollCueRef.current, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 1.2);

    return () => {
      tl.kill();
    };
  }, [onNavReveal, skipIntro]);

  const TEXT_SHADOW = "0 3px 18px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.9)";

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 pb-8"
    >
      {/* Background artwork - clearly visible */}
      <div
        ref={heroBgRef}
        className={`absolute inset-0 bg-cover bg-center ${reducedMotion ? "" : "rz-kenburns"}`}
        style={{ backgroundImage: `url(${dragonWorld})`, backgroundPosition: "center 32%", opacity: 0 }}
      />

      {/* Lightened, subtle gradient overlay so the artwork is fully seen */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,6,10,.35) 0%, transparent 20%, transparent 60%, rgba(5,6,10,.5) 85%, var(--rz-void) 100%)",
        }}
      />

      {/* Left-side readability scrim - the hero text now sits over the
          left portion of the artwork (bright cloud/mist patches in
          places), which made the lighter text colors hard to read on
          top of them. This darkens just that left region and fades to
          fully transparent by ~55% across, well before the dragon's
          head/the crystal - so the artwork's actual focal point on
          the right stays completely unobscured. */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, rgba(4,5,9,0.75) 0%, rgba(4,5,9,0.45) 28%, transparent 55%)",
        }}
      />

      {/* Interactive mouse spotlight glow */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: "radial-gradient(650px circle at 50% 40%, rgba(125,232,255,0.08), transparent 70%)",
        }}
      />

      <AmbientFog tint="rgba(125,232,255,.04)" />

      {/* Hero Content - deliberately left-anchored, not centered: the
          dragon's head and the glowing crystal beneath it sit dead
          center in dragon-world.jpg (confirmed by direct inspection)
          - centered text was sitting right on top of the artwork's
          actual focal point. Left-aligning clears that whole area. */}
      <div className="relative z-10 flex max-w-4xl flex-col items-start px-6 text-left sm:px-12 lg:pl-20">
        {/* Top pill badge */}
        <div
          ref={badgeRef}
          className="mb-3 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-[11px] font-medium tracking-wide backdrop-blur-md rz-shimmer-badge"
          style={{
            borderColor: "rgba(125,232,255,0.4)",
            background: "rgba(5,6,10,0.65)",
            color: "var(--rz-eye)",
            opacity: 0,
            transform: "translateY(12px)",
          }}
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-[var(--rz-crystal)]" aria-hidden="true" />
          <span>Unified Campus & Career Intelligence</span>
        </div>

        {/* Brand wordmark */}
        <p
          ref={wordmarkRef}
          className="rz-display mb-3 text-lg font-bold uppercase tracking-[0.22em] text-[var(--rz-eye)] sm:text-xl"
          style={{ textShadow: "0 0 20px rgba(125,232,255,.5), 0 2px 10px rgba(0,0,0,0.9)", opacity: 0, transform: "translateY(12px)" }}
        >
          RyuZen
        </p>

        {/* Main headline */}
        <h1 className="rz-display mb-4 max-w-3xl text-4xl font-extrabold uppercase leading-tight sm:text-6xl sm:leading-[1.12]">
          <span
            ref={line1Ref}
            className="block"
            style={{ color: "#F4EFE4", textShadow: TEXT_SHADOW, opacity: 0, transform: "translateY(12px)" }}
          >
            One campus.
          </span>
          <span
            ref={line2Ref}
            className="block"
            style={{
              color: "var(--rz-eye)",
              textShadow: "0 0 28px rgba(125,232,255,.6), 0 4px 25px rgba(0,0,0,.95)",
              opacity: 0,
              transform: "translateY(12px)",
            }}
          >
            Every journey.
          </span>
        </h1>

        <p
          ref={subRef}
          className="mb-7 max-w-lg text-sm leading-relaxed text-[#D6DEEB] sm:text-base"
          style={{ textShadow: TEXT_SHADOW, opacity: 0, transform: "translateY(12px)" }}
        >
          An interconnected intelligence ecosystem empowering students to prove real skill,
          organizations to elevate campus impact, and recruiters to uncover true potential.
        </p>

        {/* Dual CTAs */}
        <div
          ref={ctaRef}
          className="mb-7 flex flex-wrap items-center justify-start gap-3.5"
          style={{ opacity: 0, transform: "translateY(12px)" }}
        >
          <Link
            to="/login"
            className="group flex items-center gap-2.5 rounded-md px-8 py-3.5 text-[13.5px] font-bold uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(125,232,255,.6)]"
            style={{ background: "var(--rz-eye)", color: "#04262e" }}
          >
            <span>Enter RyuZen</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>

          <a
            href="#explore"
            className="group flex items-center gap-2 rounded-md border border-[var(--rz-mist)] bg-[rgba(11,14,20,0.65)] px-7 py-3.5 text-[13.5px] font-semibold uppercase tracking-wider text-[var(--rz-text)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--rz-eye)] hover:text-[var(--rz-eye)]"
          >
            <Compass className="h-4 w-4 text-[var(--rz-crystal)] transition-transform group-hover:rotate-45" aria-hidden="true" />
            <span>Explore Demo</span>
          </a>
        </div>

        {/* Proof Ribbon */}
        <div
          ref={ribbonRef}
          className="mb-8 flex flex-wrap items-center justify-start gap-2.5 sm:gap-3.5"
          style={{ opacity: 0, transform: "translateY(12px)" }}
        >
          <div className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(5,6,10,0.6)] px-3.5 py-1 text-[11px] text-[var(--rz-text)] backdrop-blur-md shadow-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--rz-eye)] shadow-[0_0_8px_var(--rz-eye)]" />
            <span>AI-Verified Skill Evidence</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(5,6,10,0.6)] px-3.5 py-1 text-[11px] text-[var(--rz-text)] backdrop-blur-md shadow-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--rz-gold)] shadow-[0_0_8px_var(--rz-gold)]" />
            <span>3 Connected Ecosystems</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(5,6,10,0.6)] px-3.5 py-1 text-[11px] text-[var(--rz-text)] backdrop-blur-md shadow-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--rz-crystal)] shadow-[0_0_8px_var(--rz-crystal)]" />
            <span>Instant Role Sandboxes</span>
          </div>
        </div>

        {/* Scroll Cue */}
        <a
          ref={scrollCueRef}
          href="#paths"
          className="rz-mono flex flex-col items-start gap-1.5 text-[10px] uppercase tracking-[0.14em] text-[var(--rz-text-dim)] transition-colors hover:text-[var(--rz-eye)]"
          style={{ opacity: 0, transform: "translateY(12px)" }}
        >
          <span>Continue the journey</span>
          <span className="rz-bob text-[var(--rz-eye)] text-sm">↓</span>
        </a>
      </div>
    </section>
  );
}
