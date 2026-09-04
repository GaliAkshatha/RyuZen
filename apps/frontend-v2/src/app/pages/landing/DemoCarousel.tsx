import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Loader2 } from "lucide-react";

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
 * Enhanced DemoCarousel:
 * - Quick role switcher pills for immediate one-click role selection
 * - Refined command-center cards with "Live Sandbox" status indicators
 * - Glowing one-click authentication launch button
 * - Preserves authentic seeded login flow via useDemoLogin
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

  const cardWidth = isNarrow ? 230 : 285;
  const offsetStep = isNarrow ? 155 : 205;

  function go(delta: number) {
    setActiveIndex((prev) => (prev + delta + COUNT) % COUNT);
  }

  return (
    <div className="flex flex-col items-center gap-7">
      {/* Quick Role Switcher Pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {DEMO_PREVIEWS.map((preview, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={preview.role}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-all duration-300 ${
                isActive
                  ? "scale-105 border-[var(--rz-eye)] bg-[rgba(19,23,34,0.9)] text-white shadow-[0_0_15px_rgba(125,232,255,0.3)]"
                  : "border-[rgba(255,255,255,0.08)] bg-[rgba(5,6,10,0.5)] text-[var(--rz-text-dim)] hover:border-[rgba(255,255,255,0.2)] hover:text-white"
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: preview.color }}
              />
              <span>{preview.label}</span>
            </button>
          );
        })}
      </div>

      {/* Circular Carousel Stage */}
      <div
        className="relative flex w-full max-w-xl items-center justify-center"
        style={{ height: isNarrow ? 280 : 320 }}
      >
        {DEMO_PREVIEWS.map((preview, i) => {
          const offset = circularOffset(i, activeIndex);
          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 1;

          const translateX = offset * offsetStep;
          const scale = isCenter ? 1 : Math.abs(offset) === 1 ? 0.84 : 0.65;
          const opacity = isCenter ? 1 : Math.abs(offset) === 1 ? 0.45 : 0;
          const zIndex = 10 - Math.abs(offset);

          return (
            <div
              key={preview.role}
              tabIndex={isVisible ? 0 : -1}
              aria-hidden={!isVisible}
              onMouseEnter={() => isVisible && !isCenter && setActiveIndex(i)}
              onClick={() => !isCenter && setActiveIndex(i)}
              className="absolute flex flex-col overflow-hidden rounded-xl text-left transition-all duration-500 ease-out"
              style={{
                width: cardWidth,
                transform: `translateX(${translateX}px) scale(${scale})`,
                opacity,
                zIndex,
                pointerEvents: isVisible ? "auto" : "none",
                background: "rgba(11, 14, 20, 0.92)",
                backdropFilter: "blur(16px)",
                border: `1px solid ${isCenter ? preview.color : "var(--rz-mist)"}`,
                boxShadow: isCenter ? `0 0 35px ${preview.glow}, 0 20px 40px rgba(0,0,0,0.8)` : "none",
              }}
            >
              {/* Card Header (Browser / Terminal Bar) */}
              <div
                className="flex items-center justify-between border-b px-3.5 py-2.5"
                style={{ borderColor: "var(--rz-mist-soft)", background: "rgba(5,6,10,0.6)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
                    <span className="h-2 w-2 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
                    <span className="h-2 w-2 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
                  </div>
                  <span className="rz-mono text-[9.5px] uppercase font-semibold tracking-wider" style={{ color: preview.color }}>
                    {preview.label} Workspace
                  </span>
                </div>

                <span className="flex items-center gap-1 rounded-full bg-[rgba(79,227,212,0.12)] px-2 py-0.5 text-[8.5px] font-medium text-[var(--rz-crystal)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--rz-crystal)] animate-pulse" />
                  Live
                </span>
              </div>

              {/* Card Body - Metric Tiles & Data Rows */}
              <div className="p-3.5">
                <div className="mb-3 grid grid-cols-3 gap-1.5">
                  {preview.stats.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg p-2 text-center"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <p className="rz-display text-[14px] font-extrabold" style={{ color: preview.color }}>
                        {s.value}
                      </p>
                      <p className="mt-0.5 text-[8px] uppercase tracking-wider text-[var(--rz-text-mute)] leading-tight">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  {preview.rows.map((r) => (
                    <div
                      key={r.label}
                      className="flex items-center justify-between rounded border border-[rgba(255,255,255,0.04)] bg-[rgba(5,6,10,0.4)] px-2.5 py-1.5 text-[10.5px]"
                    >
                      <span className="truncate text-[var(--rz-text-dim)]">{r.label}</span>
                      <span className="shrink-0 pl-2 font-mono font-medium" style={{ color: preview.color }}>
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Launch Action */}
              {isCenter ? (
                <div className="border-t border-[rgba(255,255,255,0.06)] bg-[rgba(5,6,10,0.4)] p-3">
                  <button
                    type="button"
                    disabled={pendingRole !== null}
                    onClick={() => enterAs(preview.role)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[11.5px] font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
                    style={{
                      background: preview.color,
                      color: "#04262e",
                      boxShadow: `0 0 16px ${preview.glow}`,
                    }}
                  >
                    {pendingRole === preview.role ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Entering {preview.label}…</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Enter Live Sandbox</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="px-3 pb-2.5 text-center">
                  <span className="rz-mono text-[9px] uppercase tracking-wider text-[var(--rz-text-mute)]">
                    Click to bring to center
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Carousel Controls */}
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous role preview"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--rz-mist)] bg-[rgba(11,14,20,0.8)] text-[var(--rz-text-dim)] transition-all hover:border-[var(--rz-eye)] hover:text-[var(--rz-eye)] hover:scale-105"
        >
          <ChevronLeft className="h-4.5 w-4.5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2">
          {DEMO_PREVIEWS.map((preview, i) => (
            <button
              key={preview.role}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`View ${preview.label}`}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === activeIndex ? "24px" : "8px",
                background: i === activeIndex ? preview.color : "var(--rz-mist)",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next role preview"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--rz-mist)] bg-[rgba(11,14,20,0.8)] text-[var(--rz-text-dim)] transition-all hover:border-[var(--rz-eye)] hover:text-[var(--rz-eye)] hover:scale-105"
        >
          <ChevronRight className="h-4.5 w-4.5" aria-hidden="true" />
        </button>
      </div>

      {error && (
        <p className="mx-auto max-w-sm rounded-lg border border-[var(--rz-mist)] bg-[rgba(19,23,34,.9)] px-4 py-3 text-center text-xs text-[var(--rz-text-dim)]">
          {error}
        </p>
      )}
    </div>
  );
}
