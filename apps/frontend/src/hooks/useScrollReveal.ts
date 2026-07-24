import { useEffect, useRef, useState } from "react";

/**
 * Lightweight, dependency-free scroll-reveal — a single IntersectionObserver
 * per element, unobserved after the first reveal (never re-triggers, so
 * scrolling back up doesn't re-animate content in a distracting loop).
 * Respects `prefers-reduced-motion`: returns already-visible immediately
 * rather than gating content behind an animation someone asked not to see.
 *
 * Deliberately built as a plain hook rather than adding an animation
 * library dependency — the Landing Page's motion needs (fade + rise,
 * staggered by a delay prop) don't need more than this.
 */
export function useScrollReveal<T extends HTMLElement>(options?: { rootMargin?: string }) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: options?.rootMargin ?? "0px 0px -80px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options?.rootMargin]);

  return { ref, isVisible };
}
