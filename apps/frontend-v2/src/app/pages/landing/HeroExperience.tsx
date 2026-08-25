import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

import dragonWorld from "@/assets/dragon-world.jpg";
import { AmbientFog } from "@/app/pages/landing/AmbientFog";

/**
 * Content rewrite per explicit direction: previous copy ("where proof
 * outweighs claims", "verified before it counts") read as security /
 * verification branding, not what RyuZen actually is. Rewritten to
 * say plainly what the product is - one campus ecosystem for
 * students, organizations, and recruiters - with less text overall so
 * the artwork dominates (kicker line and second CTA button removed
 * entirely, not just reworded).
 *
 * Real, per-line staged reveal: the visitor sees only the full hero
 * background the instant the page loads (own slow Ken Burns zoom
 * already running), completely free of text - every remaining text
 * element then reveals one at a time on its own GSAP timeline.
 *
 * prefers-reduced-motion: skips straight to the fully-revealed end
 * state, ambient zoom disabled.
 */
export function HeroExperience({ onNavReveal, skipIntro = false }: { onNavReveal: () => void; skipIntro?: boolean }) {
  const heroBgRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLAnchorElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = [wordmarkRef.current, line1Ref.current, line2Ref.current, subRef.current, ctaRef.current, scrollCueRef.current];

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
      .to(wordmarkRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 1.2)
      .to(line1Ref.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 1.65)
      .to(line2Ref.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 2.0)
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 2.45)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 2.9)
      .to(scrollCueRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 3.25);

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

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-end px-6 pb-16 text-center">
        <p ref={wordmarkRef} className="rz-display mb-5 text-xl font-bold uppercase tracking-[0.18em] text-[var(--rz-eye)]" style={{ textShadow: "0 0 18px rgba(125,232,255,.4)" }}>
          RyuZen
        </p>
        <h1 className="rz-display mb-5 max-w-2xl text-4xl font-bold uppercase leading-tight sm:text-5xl">
          <span ref={line1Ref} className="block" style={{ color: "#F4EFE4", textShadow: "0 4px 30px rgba(0,0,0,.6)" }}>
            One campus.
          </span>
          <span ref={line2Ref} className="block" style={{ color: "var(--rz-eye)", textShadow: "0 0 24px rgba(125,232,255,.5), 0 4px 30px rgba(0,0,0,.6)" }}>
            Every journey.
          </span>
        </h1>
        <p ref={subRef} className="mb-10 max-w-lg text-base leading-relaxed text-[var(--rz-text-dim)]">
          An intelligent ecosystem for students, organizations, and recruiters.
        </p>
        <div ref={ctaRef} className="mb-11">
          <Link
            to="/login"
            className="flex items-center gap-2 rounded px-8 py-3.5 text-[13.5px] font-semibold uppercase tracking-wide transition-all hover:-translate-y-0.5"
            style={{ background: "var(--rz-eye)", color: "#04262e", boxShadow: "0 0 0 rgba(125,232,255,0)" }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 24px rgba(125,232,255,.45)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 0 rgba(125,232,255,0)")}
          >
            Enter RyuZen
          </Link>
        </div>
        <a ref={scrollCueRef} href="#paths" className="rz-mono flex flex-col items-center gap-2 text-[10.5px] uppercase tracking-[0.1em] text-[var(--rz-text-mute)]">
          <span>Continue the journey</span>
          <span className="rz-bob">↓</span>
        </a>
      </div>
    </section>
  );
}
