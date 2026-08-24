import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

import dragonWorld from "@/assets/dragon-world.jpg";
import { AmbientFog } from "@/app/pages/landing/AmbientFog";

/**
 * Real, per-line staged reveal, per explicit direction: the eyes and
 * dragon-reveal intro stages were removed - the visitor now sees only
 * the full hero background the instant the page loads (with its own
 * slow Ken Burns zoom already running), completely free of text.
 * Every text element - kicker, wordmark, both headline lines,
 * supporting copy, CTAs, scroll cue - then reveals one at a time on
 * its own GSAP timeline, not all at once.
 *
 * prefers-reduced-motion: skips straight to the fully-revealed end
 * state, ambient zoom disabled.
 */
export function HeroExperience({ onNavReveal, skipIntro = false }: { onNavReveal: () => void; skipIntro?: boolean }) {
  const heroBgRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLAnchorElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = [kickerRef.current, wordmarkRef.current, line1Ref.current, line2Ref.current, subRef.current, ctaRef.current, scrollCueRef.current];

    // Returning from a demo session (Exit Demo) genuinely should not
    // replay the whole opening cinematic - skipIntro jumps straight
    // to the fully-revealed end state, same as prefersReduced.
    if (prefersReduced || skipIntro) {
      setReducedMotion(true);
      onNavReveal();
      gsap.set(heroBgRef.current, { opacity: 1 });
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(heroBgRef.current, { opacity: 0 });
    gsap.set(targets, { opacity: 0, y: 16 });

    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(heroBgRef.current, { opacity: 1, duration: 1.6, ease: "power2.out" })
      .call(onNavReveal, [], 1.0)
      .to(kickerRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 1.1)
      .to(wordmarkRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 1.55)
      .to(line1Ref.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 2.0)
      .to(line2Ref.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 2.35)
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 2.85)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 3.25)
      .to(scrollCueRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 3.6);

    return () => {
      tl.kill();
    };
  }, [onNavReveal, skipIntro]);

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div
        ref={heroBgRef}
        className={`absolute inset-0 bg-cover bg-center ${reducedMotion ? "" : "rz-kenburns"}`}
        style={{ backgroundImage: `url(${dragonWorld})`, backgroundPosition: "center 30%" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,6,10,.55) 0%, rgba(5,6,10,.2) 35%, rgba(5,6,10,.55) 68%, var(--rz-void) 100%)",
        }}
      />
      <AmbientFog />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-14 text-center">
        <div ref={kickerRef} className="rz-mono mb-5 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[var(--rz-eye)]">
          <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-[var(--rz-eye)] shadow-[0_0_8px_var(--rz-eye)]" />
          where proof outweighs claims
        </div>
        <p ref={wordmarkRef} className="rz-display mb-4 text-xl font-bold uppercase tracking-[0.18em] text-[var(--rz-eye)]" style={{ textShadow: "0 0 18px rgba(125,232,255,.4)" }}>
          RyuZen
        </p>
        <h1 className="rz-display mb-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
          <span ref={line1Ref} className="block" style={{ color: "#F4EFE4", textShadow: "0 4px 30px rgba(0,0,0,.6)" }}>
            Every achievement,
          </span>
          <span ref={line2Ref} className="block" style={{ color: "var(--rz-eye)", textShadow: "0 0 24px rgba(125,232,255,.5), 0 4px 30px rgba(0,0,0,.6)" }}>
            verified <span style={{ color: "#F4EFE4" }}>before it counts.</span>
          </span>
        </h1>
        <p ref={subRef} className="mb-9 max-w-lg text-base leading-relaxed text-[var(--rz-text-dim)]">
          No claim goes unchecked. No achievement counts unproven. RyuZen keeps the record — and only real work makes it in.
        </p>
        <div ref={ctaRef} className="mb-11 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            to="/login"
            className="flex items-center gap-2 rounded px-7 py-3.5 text-[13.5px] font-semibold uppercase tracking-wide transition-all hover:-translate-y-0.5"
            style={{ background: "var(--rz-eye)", color: "#04262e", boxShadow: "0 0 0 rgba(125,232,255,0)" }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 24px rgba(125,232,255,.45)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 0 rgba(125,232,255,0)")}
          >
            Enter RyuZen
          </Link>
          <a
            href="#paths"
            className="rounded border px-7 py-3.5 text-[13.5px] font-semibold uppercase tracking-wide backdrop-blur transition-colors"
            style={{ borderColor: "var(--rz-mist)", background: "rgba(19,23,34,.5)", color: "var(--rz-text)" }}
          >
            Explore the ecosystem
          </a>
        </div>
        <a ref={scrollCueRef} href="#paths" className="rz-mono flex flex-col items-center gap-2 text-[10.5px] uppercase tracking-[0.1em] text-[var(--rz-text-mute)]">
          <span>Continue the journey</span>
          <span className="rz-bob">↓</span>
        </a>
      </div>
    </section>
  );
}
