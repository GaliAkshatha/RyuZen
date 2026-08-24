import { useEffect, type RefObject } from "react";

import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/app/pages/landing/gsapSetup";

/**
 * One real, restrained ScrollTrigger effect reused by every scene:
 * the background layer drifts slightly slower than the scroll itself
 * (a real parallax depth cue, not just a fade), giving the "camera
 * moving through the world" feeling the brief asks for without any
 * pinning or scroll-hijacking - the page still scrolls completely
 * normally. Disabled entirely under prefers-reduced-motion.
 *
 * intensity: a real speed multiplier, not just a cosmetic knob - the
 * Final scene is meant to feel deliberately quieter/slower than the
 * rest of the page ("the final shot of a movie"), so it passes a
 * reduced value while every other scene keeps the default.
 */
export function useParallaxBackground(ref: RefObject<HTMLElement | null>, intensity = 8) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    ensureGsapRegistered();

    const trigger = ScrollTrigger.create({
      trigger: el.parentElement ?? el,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(el, { yPercent: self.progress * intensity });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [ref, intensity]);
}
