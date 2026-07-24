import { useMemo } from "react";

export type AtmosphereVariant =
  | "particles"
  | "constellation"
  | "glow"
  | "arcane-grid"
  | "academy";

interface PageAtmosphereProps {
  variant: AtmosphereVariant;
}

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface Mote {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

/**
 * Purely decorative, per-page ambient background layer — the visual
 * seam that keeps the fantasy identity alive past login rather than
 * dissolving into a flat gray dashboard. Every variant is built from
 * the existing design tokens only (no images, no external assets, no
 * copyright surface) so it automatically follows Light Fantasy / Dark
 * Fantasy Academy without extra work.
 *
 * Deliberately restrained: `aria-hidden`, `pointer-events-none`,
 * capped opacity so it never competes with foreground text contrast
 * (every page still renders its real content on the solid `--card`
 * background sitting above this layer), and animation is fully
 * disabled under `prefers-reduced-motion` via Tailwind's
 * `motion-reduce:` variant rather than a JS check.
 *
 * Deterministic per-mount pseudo-random layout (seeded by array index,
 * not Math.random on every render) so the scene doesn't visibly
 * reshuffle on re-render.
 */
export function PageAtmosphere({ variant }: PageAtmosphereProps) {
  const stars = useMemo<Star[]>(() => generateStars(variant === "constellation" ? 28 : 14), [variant]);
  const motes = useMemo<Mote[]>(() => generateMotes(10), []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {variant === "particles" && <ParticlesLayer motes={motes} />}
      {variant === "constellation" && <ConstellationLayer stars={stars} />}
      {variant === "glow" && <GlowLayer />}
      {variant === "arcane-grid" && <ArcaneGridLayer />}
      {variant === "academy" && <AcademyLayer motes={motes} />}
    </div>
  );
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = (i * 137.51) % 100;
    return {
      x: (seed * 3.7) % 100,
      y: (seed * 5.3) % 100,
      size: 1 + (i % 3),
      delay: (i % 7) * 0.4,
      duration: 2.5 + (i % 4) * 0.6,
    };
  });
}

function generateMotes(count: number): Mote[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = (i * 219.3) % 100;
    return {
      x: (seed * 2.1) % 100,
      y: (seed * 4.9) % 100,
      size: 3 + (i % 4) * 2,
      delay: (i % 5) * 0.8,
      duration: 5 + (i % 4),
    };
  });
}

function ParticlesLayer({ motes }: { motes: Mote[] }) {
  return (
    <>
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl motion-safe:animate-glow-pulse" />
      <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-secondary/10 blur-3xl motion-safe:animate-glow-pulse [animation-delay:1.2s]" />
      {motes.map((mote, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary/40 motion-safe:animate-float-slow"
          style={{
            left: `${mote.x}%`,
            top: `${mote.y}%`,
            width: mote.size,
            height: mote.size,
            animationDelay: `${mote.delay}s`,
            animationDuration: `${mote.duration}s`,
          }}
        />
      ))}
    </>
  );
}

function ConstellationLayer({ stars }: { stars: Star[] }) {
  return (
    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
      {stars.slice(0, -1).map((star, i) => {
        const next = stars[i + 1];
        if (!next || i % 4 !== 0) return null;
        return (
          <line
            key={`line-${i}`}
            x1={`${star.x}%`}
            y1={`${star.y}%`}
            x2={`${next.x}%`}
            y2={`${next.y}%`}
            stroke="hsl(var(--primary))"
            strokeOpacity={0.12}
            strokeWidth={1}
          />
        );
      })}
      {stars.map((star, i) => (
        <circle
          key={`star-${i}`}
          cx={`${star.x}%`}
          cy={`${star.y}%`}
          r={star.size}
          fill="hsl(var(--primary))"
          className="motion-safe:animate-twinkle"
          style={{ animationDelay: `${star.delay}s`, animationDuration: `${star.duration}s` }}
        />
      ))}
    </svg>
  );
}

function GlowLayer() {
  return (
    <>
      <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl motion-safe:animate-glow-pulse" />
      <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-warning/10 blur-3xl motion-safe:animate-glow-pulse [animation-delay:1.5s]" />
    </>
  );
}

function ArcaneGridLayer() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute left-1/3 top-1/4 h-2 w-2 rounded-full bg-info motion-safe:animate-twinkle" />
      <div className="absolute right-1/4 top-2/3 h-2 w-2 rounded-full bg-primary motion-safe:animate-twinkle [animation-delay:1s]" />
      <div className="absolute bottom-1/4 left-2/3 h-1.5 w-1.5 rounded-full bg-info motion-safe:animate-twinkle [animation-delay:2s]" />
    </>
  );
}

function AcademyLayer({ motes }: { motes: Mote[] }) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 to-transparent" />
      {motes.slice(0, 6).map((mote, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary/30 motion-safe:animate-float"
          style={{
            left: `${mote.x}%`,
            top: `${mote.y}%`,
            width: mote.size,
            height: mote.size,
            animationDelay: `${mote.delay}s`,
            animationDuration: `${mote.duration}s`,
          }}
        />
      ))}
    </>
  );
}
