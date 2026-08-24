import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { DEMO_PREVIEWS } from "@/app/pages/landing/demoPreviews";
import { useDemoLogin } from "@/app/pages/landing/useDemoLogin";

const COUNT = DEMO_PREVIEWS.length;

/** Wraps the raw index difference into the shortest signed distance around the circle (e.g. for 6 items: -3..2). */
function circularOffset(index: number, activeIndex: number): number {
  let offset = (index - activeIndex) % COUNT;
  if (offset > COUNT / 2) offset -= COUNT;
  if (offset < -COUNT / 2) offset += COUNT;
  return offset;
}

/**
 * Real circular "portal" windows into RyuZen, not rectangular
 * dashboard cards - round shape, a glowing ring, and only the single
 * most representative stat per role, kept deliberately sparse so it
 * reads as a magical window rather than a screenshot. Still a real
 * circular carousel: all 6 exist at once, positioned by signed
 * distance from activeIndex, only the center portal and its two
 * immediate neighbors visible. Hovering a visible side portal brings
 * it to center; arrow buttons provide the same navigation for
 * keyboard/touch users.
 */
export function DemoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNarrow, setIsNarrow] = useState(false);
  const { enterAs, pendingRole, error } = useDemoLogin();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    setIsNarrow(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const portalSize = isNarrow ? 148 : 224;
  const offsetStep = isNarrow ? 104 : 172;

  function go(delta: number) {
    setActiveIndex((prev) => (prev + delta + COUNT) % COUNT);
  }

  return (
    <div className="flex flex-col items-center gap-7">
      <div className="relative flex w-full max-w-lg items-center justify-center" style={{ height: isNarrow ? 220 : 360 }}>
        {DEMO_PREVIEWS.map((preview, i) => {
          const offset = circularOffset(i, activeIndex);
          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 1;

          const translateX = offset * offsetStep;
          const scale = isCenter ? 1 : Math.abs(offset) === 1 ? 0.68 : 0.5;
          const opacity = isCenter ? 1 : Math.abs(offset) === 1 ? 0.45 : 0;
          const zIndex = 10 - Math.abs(offset);
          const headline = preview.stats[0];

          return (
            <button
              key={preview.role}
              type="button"
              tabIndex={isVisible ? 0 : -1}
              aria-hidden={!isVisible}
              onMouseEnter={() => isVisible && !isCenter && setActiveIndex(i)}
              onFocus={() => isVisible && !isCenter && setActiveIndex(i)}
              onClick={() => (isCenter ? enterAs(preview.role) : setActiveIndex(i))}
              disabled={pendingRole !== null}
              className="absolute flex flex-col items-center justify-center gap-2 rounded-full text-center transition-all duration-500 ease-out disabled:opacity-60"
              style={{
                width: portalSize,
                height: portalSize,
                transform: `translateX(${translateX}px) scale(${scale})`,
                opacity,
                zIndex,
                pointerEvents: isVisible ? "auto" : "none",
                background: `radial-gradient(circle at 50% 35%, ${preview.glow}, rgba(11,14,20,.85) 68%)`,
                border: `1px solid ${isCenter ? preview.color : "var(--rz-mist)"}`,
                boxShadow: isCenter ? `0 0 40px ${preview.glow}, inset 0 0 30px ${preview.glow}` : "none",
              }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: preview.color, boxShadow: `0 0 10px ${preview.color}` }} />
              <span className="rz-display text-sm font-bold uppercase tracking-wide" style={{ color: preview.color }}>
                {preview.label}
              </span>
              <span className="rz-display text-2xl font-bold text-[var(--rz-text)]">{headline.value}</span>
              <span className="text-[10.5px] text-[var(--rz-text-dim)]">{headline.label}</span>
              {isCenter && (
                <span className="rz-mono mt-1 text-[9.5px] uppercase tracking-wide" style={{ color: preview.color }}>
                  {pendingRole === preview.role ? "Entering…" : "Enter →"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="flex h-8 w-8 items-center justify-center rounded-full border text-[var(--rz-text-dim)] transition-colors hover:text-[var(--rz-eye)]"
          style={{ borderColor: "var(--rz-mist)" }}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="flex gap-1.5">
          {DEMO_PREVIEWS.map((preview, i) => (
            <span
              key={preview.role}
              className="h-1.5 w-1.5 rounded-full transition-colors"
              style={{ background: i === activeIndex ? "var(--rz-eye)" : "var(--rz-mist)" }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="flex h-8 w-8 items-center justify-center rounded-full border text-[var(--rz-text-dim)] transition-colors hover:text-[var(--rz-eye)]"
          style={{ borderColor: "var(--rz-mist)" }}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {error && (
        <p className="mx-auto max-w-sm rounded border px-4 py-3 text-center text-xs text-[var(--rz-text-dim)]" style={{ borderColor: "var(--rz-mist)", background: "rgba(19,23,34,.7)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
