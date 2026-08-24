import { useEffect, useRef } from "react";
import { ShieldCheck, Lock, Sparkles, KeyRound } from "lucide-react";

import sceneCrystal from "@/assets/scene-crystal.jpg";
import { useParallaxBackground } from "@/app/pages/landing/useParallaxBackground";
import { ensureGsapRegistered, gsap } from "@/app/pages/landing/gsapSetup";
import { AmbientFog } from "@/app/pages/landing/AmbientFog";

const PRINCIPLES = [
  { icon: ShieldCheck, label: "Verified authenticity", desc: "Every achievement is verified and trusted." },
  { icon: Lock, label: "Immutable records", desc: "Tamper-resistant records that last." },
  { icon: Sparkles, label: "AI-powered insights", desc: "Intelligence that reveals true potential." },
  { icon: KeyRound, label: "Privacy first", desc: "Your data. Your control." },
];

/**
 * The crystal artwork fills the section as environment - the four
 * principles sit beside it as plain icon+text pairs, not bordered
 * tiles. This is the page's real visual climax: a one-time
 * "awakening" flash (flashRef, a separate radial-glow overlay - kept
 * apart from the background's own continuous rz-crystal-pulse
 * animation so the two don't fight over the same element) fires once
 * as the crystal scrolls into view, timed just before the four
 * principles begin their staggered reveal - the crystal visibly
 * waking up and powering what follows, not simultaneous with it.
 */
export function IntelligenceScene() {
  const bgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const principleRefs = useRef<(HTMLDivElement | null)[]>([]);
  useParallaxBackground(bgRef);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const principles = principleRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (prefersReduced || !sectionRef.current || principles.length === 0) return;

    ensureGsapRegistered();
    gsap.set([headRef.current, ...principles], { opacity: 0, y: 16 });
    gsap.set(flashRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top 65%", once: true },
    });

    tl.to(flashRef.current, { opacity: 1, duration: 0.9, ease: "power1.out" })
      .to(flashRef.current, { opacity: 0, duration: 1.4, ease: "power1.in" }, ">-0.2")
      .to(headRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "<")
      .to(principles, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.18 }, "-=0.3");

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
            <h2 className="rz-display mb-4 text-3xl font-bold sm:text-4xl" style={{ color: "#E4EEF9" }}>
              Trusted. Transparent. Timeless.
            </h2>
            <p className="mb-10 text-sm leading-relaxed text-[var(--rz-text-dim)]">
              We combine verification, AI intelligence, and immutable records to create a system where achievement is undeniable and potential is unlocked.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-7">
            {PRINCIPLES.map((p, i) => (
              <div
                key={p.label}
                ref={(el) => {
                  principleRefs.current[i] = el;
                }}
                className="flex flex-col gap-2"
              >
                <p.icon className="h-5 w-5" style={{ color: "var(--rz-eye)" }} aria-hidden="true" />
                <p className="text-[13px] font-semibold text-[var(--rz-text)]">{p.label}</p>
                <p className="text-[11.5px] leading-relaxed text-[var(--rz-text-mute)]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
