import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import sceneThreePaths from "@/assets/scene-three-paths.jpg";
import { useParallaxBackground } from "@/app/pages/landing/useParallaxBackground";
import { ensureGsapRegistered, gsap } from "@/app/pages/landing/gsapSetup";
import { AmbientFog } from "@/app/pages/landing/AmbientFog";
import { PathDetailPanel } from "@/app/pages/landing/PathDetailPanel";
import type { PathKey } from "@/app/pages/landing/pathDetails";

const PATHS: {
  key: PathKey;
  label: string;
  tagline: string;
  color: string;
  glowColor: string;
  position: string;
}[] = [
  {
    key: "student",
    label: "Student",
    tagline: "Build your journey.",
    color: "var(--rz-eye)",
    glowColor: "rgba(125,232,255,.55)",
    position: "left-[10%] sm:left-[16%]",
  },
  {
    key: "organization",
    label: "Organization",
    tagline: "Build a stronger campus.",
    color: "var(--rz-gold)",
    glowColor: "rgba(232,200,122,.55)",
    position: "left-1/2 -translate-x-1/2",
  },
  {
    key: "recruiter",
    label: "Recruiter",
    tagline: "Discover the right talent.",
    color: "var(--rz-purple)",
    glowColor: "rgba(177,140,255,.55)",
    position: "right-[10%] sm:right-[16%]",
  },
];

const TEXT_SHADOW = "0 2px 10px rgba(0,0,0,.85), 0 1px 3px rgba(0,0,0,.9)";

/**
 * The three paths are real, focusable, keyboard-reachable buttons
 * positioned directly over the artwork's own glowing paths - not
 * cards. Clicking one expands PathDetailPanel directly below this
 * section ("opening a book") with that role's real feature set;
 * clicking the same path again collapses it; clicking a different
 * path swaps the content. Every text element carries a real shadow
 * (previously missing entirely) since sitting directly over a busy,
 * high-contrast painted scene without one was genuinely hard to read
 * in places.
 */
export function EcosystemScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const narratorRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<Partial<Record<PathKey, HTMLButtonElement | null>>>({});
  const [selected, setSelected] = useState<PathKey | null>(null);
  useParallaxBackground(bgRef);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const orgEl = pathRefs.current.organization;
    const studentEl = pathRefs.current.student;
    const recruiterEl = pathRefs.current.recruiter;

    if (prefersReduced || !sceneRef.current || !orgEl || !studentEl || !recruiterEl) {
      return;
    }

    ensureGsapRegistered();
    gsap.set([narratorRef.current, orgEl, studentEl, recruiterEl], { opacity: 0, y: 18 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sceneRef.current, start: "top 70%", once: true },
    });

    // Stage 2-4: narrator, then the central (organization) destination,
    // then the two flanking paths waking up together, then done - the
    // world revealing itself as the viewer arrives, not everything
    // visible from the moment the page loads.
    tl.to(narratorRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
      .to(orgEl, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.25")
      .to([studentEl, recruiterEl], { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.15 }, "-=0.2");

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  function setActive(key: PathKey | null) {
    const el = sceneRef.current;
    if (!el) return;
    (["student", "organization", "recruiter"] as PathKey[]).forEach((k) => {
      el.style.setProperty(`--glow-${k}`, k === key ? "1" : key ? "0.35" : "0.7");
    });
  }

  function togglePath(key: PathKey) {
    const isOpening = selected !== key;
    setSelected((prev) => (prev === key ? null : key));

    if (isOpening) {
      // Real fix for a confirmed bug: scrolling too early (previously
      // 120ms) meant the browser's smooth-scroll was targeting a
      // layout that was STILL actively growing underneath it - the
      // panel's own height tween runs for 600ms. Racing a native
      // smooth-scroll against a resizing target is what caused the
      // scroll position to appear frozen. Waiting until the height
      // animation has genuinely settled first means the layout is
      // stable before the scroll ever starts.
      //
      // Also fixed: the scroll target itself. Scrolling to the
      // SECTION's bottom edge (block: "end") pushed the path buttons
      // themselves (which sit at the section's own bottom) up until
      // they collided with the fixed nav bar - confirmed via a real
      // recorded session, this read as the page "locking" on a
      // broken position rather than showing what had opened. Now
      // scrolls to the panel itself once it exists, aligning its top
      // just below the nav (scroll-margin-top on the panel handles
      // that offset automatically).
      window.setTimeout(() => {
        document.getElementById("path-detail-panel")?.scrollIntoView({ block: "start", behavior: "smooth" });
      }, 650);
    }
  }

  return (
    <>
      <section
        id="paths"
        ref={sceneRef}
        className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden px-6 py-24"
        style={
          {
            "--glow-student": 0.7,
            "--glow-organization": 0.7,
            "--glow-recruiter": 0.7,
          } as CSSProperties
        }
      >
        <div ref={bgRef} className="absolute -inset-y-[6%] inset-x-0 bg-cover bg-center" style={{ backgroundImage: `url(${sceneThreePaths})`, backgroundPosition: "center 40%" }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--rz-void) 0%, transparent 14%, transparent 70%, rgba(5,6,10,.55) 88%, var(--rz-void) 100%), linear-gradient(90deg, rgba(5,6,10,.4), transparent 30%, transparent 70%, rgba(5,6,10,.4))",
          }}
        />
        <AmbientFog tint="rgba(232,200,122,.04)" />

        <div ref={narratorRef} className="relative z-10 mx-auto mb-16 max-w-lg text-center">
          <h2 className="rz-display mb-4 text-3xl font-bold uppercase sm:text-4xl" style={{ color: "#F0F2F6", textShadow: TEXT_SHADOW }}>
            One campus.
            <br />
            Three perspectives.
          </h2>
        </div>

        <div className="relative z-10 mt-auto flex flex-col items-center gap-10 sm:block sm:h-[230px]">
          {PATHS.map((path) => (
            <button
              key={path.key}
              ref={(el) => {
                pathRefs.current[path.key] = el;
              }}
              type="button"
              aria-pressed={selected === path.key}
              onMouseEnter={() => setActive(path.key)}
              onFocus={() => setActive(path.key)}
              onMouseLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
              onClick={() => togglePath(path.key)}
              className={`group relative flex flex-col items-center gap-2.5 text-center sm:absolute sm:bottom-0 ${path.position}`}
            >
              <span
                className="pointer-events-none absolute -inset-x-14 -inset-y-10 rounded-full blur-2xl transition-opacity duration-500"
                style={{ background: path.glowColor, opacity: `calc(var(--glow-${path.key}) * 0.35)` }}
              />
              <span className="pointer-events-none absolute -top-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rz-particle-rise absolute h-1 w-1 rounded-full" style={{ background: path.color, animationDelay: "0s" }} />
                <span className="rz-particle-rise absolute h-1 w-1 rounded-full" style={{ background: path.color, animationDelay: "0.5s" }} />
                <span className="rz-particle-rise absolute h-1 w-1 rounded-full" style={{ background: path.color, animationDelay: "1s" }} />
              </span>
              <span
                className="relative flex h-11 w-11 items-center justify-center rounded-full border transition-transform duration-300 group-hover:scale-110"
                style={{
                  borderColor: path.color,
                  boxShadow: selected === path.key ? `0 0 22px ${path.glowColor}` : `0 0 18px ${path.glowColor}`,
                  background: selected === path.key ? "rgba(5,6,10,.5)" : "transparent",
                }}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: path.color }} />
              </span>
              <span
                className="relative rounded px-2.5 py-1 rz-display text-sm font-bold uppercase tracking-wide"
                style={{ color: path.color, textShadow: TEXT_SHADOW, background: "rgba(5,6,10,.4)" }}
              >
                {path.label}
              </span>
              <span className="relative rounded px-2 py-0.5 text-[11.5px] text-[var(--rz-text-dim)]" style={{ textShadow: TEXT_SHADOW }}>
                {path.tagline}
              </span>
            </button>
          ))}
        </div>
      </section>

      <PathDetailPanel selected={selected} />
    </>
  );
}
