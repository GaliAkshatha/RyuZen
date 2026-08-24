import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/**
 * Registers ScrollTrigger exactly once, no matter how many landing
 * scene components call this on mount - gsap.registerPlugin is
 * itself idempotent, but tracking it explicitly avoids relying on
 * that internal detail and makes the intent obvious to the next
 * person reading this file.
 */
export function ensureGsapRegistered(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
