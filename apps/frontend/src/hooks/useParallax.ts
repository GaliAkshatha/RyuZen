import { useEffect, useState } from "react";

/**
 * Minimal scroll-linked parallax offset for a single element — used
 * only on the Hero's atmosphere layer, deliberately subtle (`strength`
 * defaults low) so it reads as depth, not a gimmick. Throttled via
 * requestAnimationFrame, disabled entirely under prefers-reduced-motion.
 */
export function useParallax(strength = 0.15): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setOffset(window.scrollY * strength);
        ticking = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [strength]);

  return offset;
}
