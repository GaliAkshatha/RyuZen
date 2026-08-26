import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

import dragonWorld from "@/assets/dragon-world.jpg";
import { AmbientFog } from "@/app/pages/landing/AmbientFog";

/**
 * Real fix for a confirmed flash-of-content bug ("glitch" on load):
 * every element used to start at its default (fully visible) style,
 * only getting hidden via gsap.set() inside useEffect - which runs
 * AFTER the first paint. That meant one real visible frame of
 * everything fully shown, then a sudden snap to hidden, then the
 * fade back in. Every animated element below now starts hidden via
 * an inline style set directly in the JSX (opacity: 0, present on
 * the very first render, before any JS runs) - GSAP then only ever
 * animates FROM that already-correct hidden state, never TO it.
 *
 * Timing: background settles in first, then a real pause with only
 * the dragon visible (no text at all) before the wordmark begins -
 * "see the dragon for a few seconds" was explicit direction, not
 * assumed.
 *
 * prefers-reduced-motion / skipIntro: both skip straight to the
 * fully-revealed end state, ambient zoom disabled.
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

    if (prefersReduced || skipIntro) {
      setReducedMotion(true);
      onNavReveal();
      gsap.set(heroBgRef.current, { opacity: 1 });
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ delay: 0.2 });

    tl.to(heroBgRef.current, { opacity: 1, duration: 1.6, ease: "power2.out" })
      .call(onNavReveal, [], 1.2)
      // Real pause here: background is fully in by ~1.8s, but the
      // first text doesn't start until 2.6s - almost a full second of
      // just the dragon, nothing else.
      .to(wordmarkRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 2.2)
      .to(line1Ref.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 2.65)
      .to(line2Ref.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 3.0)
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 3.45)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 3.9)
      .to(scrollCueRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 4.25);

    return () => {
      tl.kill();
    };
  }, [onNavReveal, skipIntro]);

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div
        ref={heroBgRef}
        className={`absolute inset-0 bg-cover bg-center ${reducedMotion ? "" : "rz-kenburns"}`}
        style={{ backgroundImage: `url(${dragonWorld})`, backgroundPosition: "center 30%", opacity: 0 }}
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
        <p
          ref={wordmarkRef}
          className="rz-display mb-5 text-xl font-bold uppercase tracking-[0.18em] text-[var(--rz-eye)]"
          style={{ textShadow: "0 0 18px rgba(125,232,255,.4)", opacity: 0, transform: "translateY(16px)" }}
        >
          RyuZen
        </p>
        <h1 className="rz-display mb-5 max-w-2xl text-4xl font-bold uppercase leading-tight sm:text-5xl">
          <span
            ref={line1Ref}
            className="block"
            style={{ color: "#F4EFE4", textShadow: "0 4px 30px rgba(0,0,0,.6)", opacity: 0, transform: "translateY(16px)" }}
          >
            One campus.
          </span>
          <span
            ref={line2Ref}
            className="block"
            style={{
              color: "var(--rz-eye)",
              textShadow: "0 0 24px rgba(125,232,255,.5), 0 4px 30px rgba(0,0,0,.6)",
              opacity: 0,
              transform: "translateY(16px)",
            }}
          >
            Every journey.
          </span>
        </h1>
        <p ref={subRef} className="mb-10 max-w-lg text-base leading-relaxed text-[var(--rz-text-dim)]" style={{ opacity: 0, transform: "translateY(16px)" }}>
          An intelligent ecosystem for students, organizations, and recruiters.
        </p>
        <div ref={ctaRef} className="mb-11" style={{ opacity: 0, transform: "translateY(16px)" }}>
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
        <a
          ref={scrollCueRef}
          href="#paths"
          className="rz-mono flex flex-col items-center gap-2 text-[10.5px] uppercase tracking-[0.1em] text-[var(--rz-text-mute)]"
          style={{ opacity: 0, transform: "translateY(16px)" }}
        >
          <span>Continue the journey</span>
          <span className="rz-bob">↓</span>
        </a>
      </div>
    </section>
  );
}
