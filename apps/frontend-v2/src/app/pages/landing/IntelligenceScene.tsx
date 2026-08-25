import { useEffect, useRef } from "react";
import { ClipboardList, Sparkles, Target, UserSearch } from "lucide-react";

import sceneCrystal from "@/assets/scene-crystal.jpg";
import { useParallaxBackground } from "@/app/pages/landing/useParallaxBackground";
import { ensureGsapRegistered, gsap } from "@/app/pages/landing/gsapSetup";
import { AmbientFog } from "@/app/pages/landing/AmbientFog";

/**
 * Content rewrite per explicit direction: this section previously
 * read as security/compliance branding ("Trusted. Transparent.
 * Timeless.", "Verified Authenticity", "Immutable Records") - none of
 * which is what RyuZen actually does. Replaced with the real idea:
 * everything a student does on campus connects into one picture that
 * organizations and recruiters can actually use - a real flow
 * (activity -> skills -> readiness -> discovery), not a security
 * pitch. Visual structure (2x2 grid beside the crystal, the one-time
 * awakening flash before the stagger) is unchanged.
 */
const CONNECTIONS = [
  { icon: ClipboardList, label: "Campus activity", desc: "Everything a student does, tracked as it happens." },
  { icon: Sparkles, label: "Skills & growth", desc: "Real experience building into a real skill set." },
  { icon: Target, label: "Career readiness", desc: "One clear picture of where a student actually stands." },
  { icon: UserSearch, label: "Talent discovery", desc: "Recruiters find the right fit, faster." },
];

export function IntelligenceScene() {
  const bgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const connectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  useParallaxBackground(bgRef);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connections = connectionRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (prefersReduced || !sectionRef.current || connections.length === 0) return;

    ensureGsapRegistered();
    gsap.set([headRef.current, ...connections], { opacity: 0, y: 16 });
    gsap.set(flashRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top 65%", once: true },
    });

    tl.to(flashRef.current, { opacity: 1, duration: 0.9, ease: "power1.out" })
      .to(flashRef.current, { opacity: 0, duration: 1.4, ease: "power1.in" }, ">-0.2")
      .to(headRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "<")
      .to(connections, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.18 }, "-=0.3");

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section id="intelligence" ref={sectionRef} className="relative min-h-[85vh] overflow-hidden px-6 py-28">
      <div ref={bgRef} className="absolute -inset-y-[6%] inset-x-0 rz-crystal-pulse bg-cover" style={{ backgroundImage: `url(${sceneCrystal})`, backgroundPosition: "20% center" }} />
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 700px 500px at 22% 45%, rgba(125,232,255,.35), transparent 65%)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--rz-void) 0%, transparent 12%, transparent 88%, var(--rz-void) 100%), linear-gradient(90deg, rgba(5,6,10,.15) 0%, rgba(5,6,10,.55) 46%, var(--rz-ink) 62%, var(--rz-ink) 100%)",
        }}
      />
      <AmbientFog tint="rgba(79,227,212,.05)" />

      <div className="relative z-10 mx-auto flex max-w-5xl items-center">
        <div className="hidden flex-1 lg:block" aria-hidden="true" />
        <div className="max-w-md lg:pl-8">
          <div ref={headRef}>
            <p className="rz-mono mb-3 text-[11px] uppercase tracking-[0.14em] text-[var(--rz-eye)]">The RyuZen intelligence layer</p>
            <h2 className="rz-display mb-4 text-3xl font-bold uppercase sm:text-4xl" style={{ color: "#E4EEF9" }}>
              Everything connects.
            </h2>
            <p className="mb-10 text-sm leading-relaxed text-[var(--rz-text-dim)]">
              Every activity, skill, and achievement connects into one clear picture — helping students grow,
              organizations engage, and recruiters discover real potential.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-7">
            {CONNECTIONS.map((c, i) => (
              <div
                key={c.label}
                ref={(el) => {
                  connectionRefs.current[i] = el;
                }}
                className="flex flex-col gap-2"
              >
                <c.icon className="h-5 w-5" style={{ color: "var(--rz-eye)" }} aria-hidden="true" />
                <p className="text-[13px] font-semibold text-[var(--rz-text)]">{c.label}</p>
                <p className="text-[11.5px] leading-relaxed text-[var(--rz-text-mute)]">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
