import type { ReactNode } from "react";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/utils/cn";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}

/**
 * Fade-and-rise reveal on scroll, used throughout the Landing Page so
 * content arrives as the visitor scrolls to it rather than all at once
 * — the pacing that makes a page feel like a story being told instead
 * of a document being loaded. `delay` (ms) staggers a group of
 * siblings (see FeatureCard grids, timeline steps).
 */
export function ScrollReveal({ children, delay = 0, className, as = "div" }: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className,
      )}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
