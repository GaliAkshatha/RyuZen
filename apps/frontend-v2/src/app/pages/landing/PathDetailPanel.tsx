import { useEffect, useRef } from "react";

import { PATH_DETAILS, type PathKey } from "@/app/pages/landing/pathDetails";
import { ensureGsapRegistered, gsap } from "@/app/pages/landing/gsapSetup";

/**
 * "Opening a book": clicking a path in EcosystemScene expands this
 * panel open (real GSAP height animation, not a fake CSS max-height
 * hack), pushing IntelligenceScene further down the page rather than
 * overlaying it. Switching between roles cross-fades the content
 * instead of an abrupt swap; selecting the same role again collapses
 * it closed. Color and glow are entirely derived from the selected
 * path (blue/gold/purple), matching the path itself, not a fixed
 * palette.
 */
export function PathDetailPanel({ selected }: { selected: PathKey | null }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevSelected = useRef<PathKey | null>(null);

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
      // Closed -> open: header, then the "why us" callout, then the four items rise in one at a time
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
      // Swapping between two roles - cross-fade the whole content, then
      // restagger the new role's items in, keeping the panel open
      gsap.fromTo(content, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: dur * 0.8, ease: "power2.out" });
      gsap.fromTo(items, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: dur * 0.5, ease: "power2.out", stagger: 0.1, delay: dur * 0.3 });
    }

    prevSelected.current = selected;

    return () => {
      gsap.killTweensOf([wrapper, content, header, why, ...items]);
    };
  }, [selected]);

  const detail = selected ? PATH_DETAILS[selected] : null;

  return (
    <div id="path-detail-panel" ref={wrapperRef} className="relative overflow-hidden" style={{ height: 0, opacity: 0, scrollMarginTop: 90 }}>
      {detail && (
        <div
          ref={contentRef}
          className="relative px-6 py-16 sm:px-12"
          style={{
            background: `radial-gradient(ellipse 900px 500px at 50% 0%, ${detail.glow}, transparent 60%), var(--rz-void)`,
          }}
        >
          <div className="mx-auto max-w-4xl">
            <div ref={headerRef}>
              <p className="rz-mono mb-2 text-center text-[11px] uppercase tracking-[0.14em]" style={{ color: detail.color }}>
                For {detail.label.toLowerCase()}s
              </p>
              <h3 className="rz-display mb-2 text-center text-2xl font-bold sm:text-3xl" style={{ color: detail.color }}>
                {detail.label}
              </h3>
              <p className="mx-auto mb-8 max-w-md text-center text-sm leading-relaxed text-[var(--rz-text-dim)]">{detail.tagline}</p>
            </div>

            <div ref={whyRef} className="mx-auto mb-10 max-w-lg rounded-lg border-l-2 px-5 py-4 text-center" style={{ borderColor: detail.color, background: "rgba(5,6,10,.4)" }}>
              <p className="text-[13px] italic leading-relaxed text-[var(--rz-text)]">"{detail.whyUs}"</p>
            </div>

            <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
              {detail.items.map((item, i) => (
                <div
                  key={item.title}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="flex gap-4"
                >
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: detail.color }} aria-hidden="true" />
                  <div>
                    <p className="mb-1 text-[13.5px] font-semibold text-[var(--rz-text)]">{item.title}</p>
                    <p className="text-[12px] leading-relaxed text-[var(--rz-text-dim)]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
