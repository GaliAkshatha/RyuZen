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
 * Real rectangular dashboard-snapshot cards, per explicit correction
 * (circular portals with a single stat weren't what was asked for) -
 * each card is a real browser-chrome-style frame showing a genuine
 * snapshot: 3 stat tiles plus 2 real list rows, so it reads as
 * "here's what that role's dashboard actually looks like," not a
 * single floating number. Still a real circular carousel underneath:
 * all 6 exist at once, positioned by signed distance from
 * activeIndex, only the center card and its two immediate neighbors
 * visible. Hovering a visible side card brings it to center; arrow
 * buttons provide the same navigation for keyboard/touch users.
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

  const cardWidth = isNarrow ? 220 : 268;
  const offsetStep = isNarrow ? 150 : 190;

  function go(delta: number) {
    setActiveIndex((prev) => (prev + delta + COUNT) % COUNT);
  }

  return (
    <div className="flex flex-col items-center gap-7">
      <div className="relative flex w-full max-w-lg items-center justify-center" style={{ height: isNarrow ? 260 : 300 }}>
        {DEMO_PREVIEWS.map((preview, i) => {
          const offset = circularOffset(i, activeIndex);
          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 1;

          const translateX = offset * offsetStep;
          const scale = isCenter ? 1 : Math.abs(offset) === 1 ? 0.82 : 0.65;
          const opacity = isCenter ? 1 : Math.abs(offset) === 1 ? 0.4 : 0;
          const zIndex = 10 - Math.abs(offset);

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
              className="absolute flex flex-col overflow-hidden rounded-lg text-left transition-all duration-500 ease-out disabled:opacity-60"
              style={{
                width: cardWidth,
                transform: `translateX(${translateX}px) scale(${scale})`,
                opacity,
                zIndex,
                pointerEvents: isVisible ? "auto" : "none",
                background: "rgba(11,14,20,.9)",
                border: `1px solid ${isCenter ? preview.color : "var(--rz-mist)"}`,
                boxShadow: isCenter ? `0 0 30px ${preview.glow}` : "none",
              }}
            >
              {/* browser-chrome bar */}
              <div className="flex items-center gap-3 border-b px-3 py-2" style={{ borderColor: "var(--rz-mist-soft)" }}>
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--rz-mist)" }} />
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--rz-mist)" }} />
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--rz-mist)" }} />
                </div>
                <span className="rz-mono text-[9px] uppercase tracking-wide" style={{ color: preview.color }}>
                  {preview.label}
                </span>
              </div>

              <div className="p-3">
                <div className="mb-2.5 grid grid-cols-3 gap-1.5">
                  {preview.stats.map((s) => (
                    <div key={s.label} className="rounded px-1 py-1.5 text-center" style={{ background: "rgba(255,255,255,.03)" }}>
                      <p className="rz-display text-[13px] font-bold" style={{ color: preview.color }}>
                        {s.value}
                      </p>
                      <p className="text-[7.5px] leading-tight text-[var(--rz-text-mute)]">{s.label}</p>
                    </div>
                  ))}
                </div>
                {preview.rows.map((r) => (
                  <div key={r.label} className="flex items-center justify-between border-t py-1.5 text-[10px]" style={{ borderColor: "var(--rz-mist-soft)" }}>
                    <span className="truncate text-[var(--rz-text-dim)]">{r.label}</span>
                    <span className="shrink-0 pl-2 font-medium" style={{ color: preview.color }}>
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>

              {isCenter && (
                <div className="rz-mono px-3 pb-2.5 text-[9.5px] uppercase tracking-wide" style={{ color: preview.color }}>
                  {pendingRole === preview.role ? "Entering…" : "Enter →"}
                </div>
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
