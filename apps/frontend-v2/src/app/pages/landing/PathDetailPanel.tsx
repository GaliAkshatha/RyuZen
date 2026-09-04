import { useEffect, useRef } from "react";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

import { PATH_DETAILS, type PathKey } from "@/app/pages/landing/pathDetails";
import { ensureGsapRegistered, gsap } from "@/app/pages/landing/gsapSetup";
import { useDemoLogin } from "@/app/pages/landing/useDemoLogin";
import type { DemoRole } from "@/app/pages/landing/demoAccounts";

interface PathDetailPanelProps {
  selected: PathKey | null;
  onSelectRole?: (role: PathKey) => void;
}

/**
 * Enhanced PathDetailPanel:
 * - Direct "Launch Live Sandbox" button linked straight to authentic seeded demo session
 * - Glassmorphic feature capability cards with subtle hover lift
 * - Header with quote callout and role accent colors
 * - Cross-fade and smooth height tweening via GSAP
 */
export function PathDetailPanel({ selected }: PathDetailPanelProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevSelected = useRef<PathKey | null>(null);

  const { enterAs, pendingRole, error } = useDemoLogin();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    const header = headerRef.current;
    const why = whyRef.current;
    if (!wrapper || !content) return;

    ensureGsapRegistered();
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = prefersReduced ? 0.01 : 0.6;
    const items = itemRefs.current.filter((el): el is HTMLDivElement => el !== null);

    if (selected && !prevSelected.current) {
      // Closed -> open
      gsap.set(wrapper, { height: 0, opacity: 0 });
      gsap.set([header, why, ...items], { opacity: 0, y: 14 });
      gsap.to(wrapper, { height: "auto", opacity: 1, duration: dur, ease: "power2.out" });
      gsap.to(header, { opacity: 1, y: 0, duration: dur * 0.7, ease: "power2.out", delay: dur * 0.3 });
      gsap.to(why, { opacity: 1, y: 0, duration: dur * 0.7, ease: "power2.out", delay: dur * 0.55 });
      gsap.to(items, { opacity: 1, y: 0, duration: dur * 0.6, ease: "power2.out", stagger: 0.12, delay: dur * 0.85 });
    } else if (!selected && prevSelected.current) {
      // Open -> closed
      gsap.to(wrapper, { height: 0, opacity: 0, duration: dur, ease: "power2.in" });
    } else if (selected && prevSelected.current && selected !== prevSelected.current) {
      // Swapping between two roles
      gsap.fromTo(content, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: dur * 0.8, ease: "power2.out" });
      gsap.fromTo(items, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: dur * 0.5, ease: "power2.out", stagger: 0.1, delay: dur * 0.3 });
    }

    prevSelected.current = selected;

    return () => {
      gsap.killTweensOf([wrapper, content, header, why, ...items]);
    };
  }, [selected]);

  const detail = selected ? PATH_DETAILS[selected] : null;

  // Map path key to demo role
  const demoRoleKey: DemoRole | null =
    selected === "student" ? "student" : selected === "organization" ? "organization" : selected === "recruiter" ? "recruiter" : null;

  return (
    <div
      id="path-detail-panel"
      ref={wrapperRef}
      className="relative overflow-hidden"
      style={{ height: 0, opacity: 0, scrollMarginTop: 90 }}
    >
      {detail && (
        <div
          ref={contentRef}
          className="relative px-6 py-16 sm:px-12"
          style={{
            background: `radial-gradient(ellipse 900px 500px at 50% 0%, ${detail.glow}, transparent 65%), var(--rz-void)`,
          }}
        >
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div ref={headerRef} className="text-center">
              <div
                className="mb-2.5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-mono uppercase tracking-[0.14em]"
                style={{ borderColor: detail.color, color: detail.color, background: "rgba(5,6,10,0.6)" }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Tailored for {detail.label}s</span>
              </div>
              <h3 className="rz-display mb-2 text-2xl font-bold sm:text-4xl" style={{ color: detail.color }}>
                {detail.label} Experience
              </h3>
              <p className="mx-auto mb-7 max-w-lg text-sm leading-relaxed text-[var(--rz-text-dim)]">
                {detail.tagline}
              </p>
            </div>

            {/* Why Us / Philosophy callout */}
            <div
              ref={whyRef}
              className="mx-auto mb-10 max-w-xl rounded-xl border-l-3 px-6 py-4.5 backdrop-blur-md"
              style={{
                borderColor: detail.color,
                background: "rgba(11,14,20,.7)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              <p className="text-[13.5px] italic leading-relaxed text-[var(--rz-text)]">
                "{detail.whyUs}"
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {detail.items.map((item, i) => (
                <div
                  key={item.title}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="rz-glass-card group flex items-start gap-4 rounded-xl p-5"
                >
                  <div
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-110"
                    style={{
                      borderColor: detail.color,
                      background: "rgba(5,6,10,0.6)",
                      color: detail.color,
                    }}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-semibold text-[var(--rz-text)]">{item.title}</p>
                      <CheckCircle2 className="h-3.5 w-3.5 text-[var(--rz-crystal)] opacity-70" aria-hidden="true" />
                    </div>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--rz-text-dim)]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Sandbox Launcher CTA */}
            {demoRoleKey && (
              <div className="mt-12 flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={pendingRole !== null}
                  onClick={() => enterAs(demoRoleKey)}
                  className="group flex items-center gap-2.5 rounded-lg px-8 py-3 text-[13px] font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] disabled:opacity-60"
                  style={{
                    background: detail.color,
                    color: "#04262e",
                    boxShadow: `0 0 24px ${detail.glow}`,
                  }}
                >
                  <span>
                    {pendingRole === demoRoleKey
                      ? "Entering Sandbox…"
                      : `Launch Live ${detail.label} Sandbox →`}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <p className="text-center text-[11px] text-[var(--rz-text-mute)]">
                  Instant one-click demo login · No credentials or sign-up needed
                </p>
                {error && (
                  <p className="rounded border border-[var(--rz-mist)] bg-[rgba(19,23,34,0.9)] px-4 py-2 text-xs text-[var(--rz-text-dim)]">
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
