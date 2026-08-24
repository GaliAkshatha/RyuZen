import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import sceneFinalTraveler from "@/assets/scene-final-traveler.jpg";
import { useParallaxBackground } from "@/app/pages/landing/useParallaxBackground";
import { ensureGsapRegistered, gsap } from "@/app/pages/landing/gsapSetup";

/**
 * The emotional conclusion - kept deliberately minimal, and
 * deliberately quieter than every scene before it: a slower parallax
 * (see the reduced intensity passed to useParallaxBackground) and a
 * slow, single fade-in for the text rather than the staggered,
 * energetic reveals used elsewhere on the page - "the final shot of
 * a movie," not another beat in the same rhythm. Content sits in the
 * artwork's real negative space on the left; the traveler and moon
 * (positioned center-right in the supplied artwork) stay fully
 * unobstructed.
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
    gsap.set(contentRef.current, { opacity: 0, y: 10 });

    const tween = gsap.to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.6,
      ease: "power1.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 60%", once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative flex min-h-[88vh] items-center overflow-hidden px-6 py-28 sm:px-14">
      <div
        ref={bgRef}
        className="absolute -inset-y-[6%] inset-x-0 bg-cover"
        style={{ backgroundImage: `url(${sceneFinalTraveler})`, backgroundPosition: "68% center" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--rz-void) 0%, transparent 16%, transparent 78%, var(--rz-void) 100%), linear-gradient(90deg, var(--rz-void) 0%, rgba(5,6,10,.72) 30%, rgba(5,6,10,.25) 52%, transparent 68%)",
        }}
      />

      <div ref={contentRef} className="relative z-10 max-w-md text-left">
        <p className="rz-mono mb-3 text-[11px] uppercase tracking-[0.14em] text-[var(--rz-eye)]">The journey awaits</p>
        <h2 className="rz-display mb-4 text-3xl font-bold leading-tight sm:text-4xl" style={{ color: "#F4EFE4" }}>
          Your <span style={{ color: "var(--rz-eye)", textShadow: "0 0 20px rgba(125,232,255,.4)" }}>legacy</span> starts here.
        </h2>
        <p className="mb-9 text-sm leading-relaxed text-[var(--rz-text-dim)]">
          Step into a world where proof is power and every achievement shapes tomorrow.
        </p>
        <div className="flex flex-wrap items-center gap-3.5">
          <Link
            to="/login"
            className="rounded px-7 py-3.5 text-[13.5px] font-semibold uppercase tracking-wide transition-all hover:-translate-y-0.5"
            style={{ background: "var(--rz-eye)", color: "#04262e" }}
          >
            Begin your journey
          </Link>
          <a
            href="#paths"
            className="rounded border px-7 py-3.5 text-[13.5px] font-semibold uppercase tracking-wide backdrop-blur transition-colors"
            style={{ borderColor: "var(--rz-mist)", background: "rgba(19,23,34,.5)", color: "var(--rz-text)" }}
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}
