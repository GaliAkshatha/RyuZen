import { useEffect, useRef } from "react";

import { ensureGsapRegistered, gsap } from "@/app/pages/landing/gsapSetup";

/**
 * A real transition zone between two scenes, not a static gradient
 * painted at each scene's own edge. Genuinely separate dark space
 * with drifting fog - as the viewer scrolls through it, its own
 * opacity rises then falls (scroll-scrubbed, peaking in the middle),
 * so there's a real moment where the previous world has faded to
 * near-black mist before the next one resolves into view, rather
 * than one image's edge touching the next image's edge directly.
 * Height varies per boundary so consecutive transitions don't feel
 * mechanically identical.
 *
 * variant="convergence" is the one specific moment between Paths and
 * Intelligence where the three path colors (blue/gold/purple) visibly
 * narrow toward the center as the viewer scrolls through - the three
 * paths genuinely feeding into the crystal, not just three more
 * generic mist clouds.
 */
export function SceneMist({
  height = 160,
  variant = "drift",
}: {
  height?: number;
  variant?: "drift" | "convergence" | "data-stream" | "horizon";
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);
  const beamsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const mist = mistRef.current;
    if (!wrap || !mist) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set(mist, { opacity: 0.55 });
      return;
    }

    ensureGsapRegistered();

    const trigger = gsap.to(mist, {
      opacity: 1,
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
      keyframes: { opacity: [0, 1, 0], easeEach: "power1.inOut" },
    });

    let beamsTrigger: gsap.core.Tween | null = null;
    if (variant === "convergence" && beamsRef.current) {
      const beams = beamsRef.current.querySelectorAll<HTMLElement>("[data-beam]");
      beamsTrigger = gsap.to(beams, {
        scaleX: 0.15,
        opacity: 0.9,
        scrollTrigger: {
          trigger: wrap,
          start: "top bottom",
          end: "center center",
          scrub: 1,
        },
      });
    }

    return () => {
      trigger.scrollTrigger?.kill();
      trigger.kill();
      beamsTrigger?.scrollTrigger?.kill();
      beamsTrigger?.kill();
    };
  }, [variant]);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden"
      style={{
        height,
        background: "radial-gradient(ellipse 900px 100% at 50% 50%, rgba(125,232,255,.05), var(--rz-void) 75%)",
      }}
    >
      <div ref={mistRef} className="absolute inset-0 opacity-0">
        <div className="rz-mist-drift absolute -left-1/4 top-1/2 h-[260px] w-[75%] -translate-y-1/2 rounded-full blur-3xl" style={{ background: "rgba(125,232,255,.16)" }} />
        <div className="rz-mist-drift-rev absolute -right-1/4 top-1/2 h-[260px] w-[75%] -translate-y-1/2 rounded-full blur-3xl" style={{ background: "rgba(45,212,167,.13)" }} />
      </div>
      {variant === "convergence" && (
        <div ref={beamsRef} className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div data-beam className="absolute left-0 top-1/2 h-[3px] w-[42%] origin-left -translate-y-1/2 opacity-40" style={{ background: "linear-gradient(90deg, transparent, var(--rz-eye))" }} />
          <div data-beam className="absolute right-0 top-1/2 h-[3px] w-[42%] origin-right -translate-y-1/2 opacity-40" style={{ background: "linear-gradient(270deg, transparent, var(--rz-purple))" }} />
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "var(--rz-crystal)", boxShadow: "0 0 24px var(--rz-crystal)" }} />
        </div>
      )}
      {variant === "data-stream" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[1px] w-[60%] opacity-40" style={{ background: "linear-gradient(90deg, transparent, var(--rz-eye), var(--rz-crystal), transparent)" }} />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "var(--rz-eye)", boxShadow: "0 0 12px var(--rz-eye)" }} />
        </div>
      )}
      {variant === "horizon" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[1px] w-[50%] opacity-35" style={{ background: "linear-gradient(90deg, transparent, var(--rz-gold), var(--rz-eye), transparent)" }} />
          <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "var(--rz-gold)", boxShadow: "0 0 10px var(--rz-gold)" }} />
        </div>
      )}
    </div>
  );
}
