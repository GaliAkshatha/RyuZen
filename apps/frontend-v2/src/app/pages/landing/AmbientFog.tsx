/**
 * A real, restrained "the world is alive" layer for inside a scene's
 * own body - not just at the transition boundaries (see SceneMist).
 * Two slow-drifting blurred glow shapes plus a handful of tiny static
 * dust particles with a gentle opacity pulse. Pure CSS, no per-frame
 * JS - GPU-friendly transforms only (opacity, translate), and the
 * particle count is deliberately small per the brief's own
 * performance guidance. Respects prefers-reduced-motion globally via
 * the existing .ryuzen-landing media query in landing.css, which
 * collapses all animation-duration to near-zero - no separate
 * handling needed here.
 */
export function AmbientFog({ tint = "rgba(125,232,255,.05)" }: { tint?: string }) {
  const dustPositions = [
    { left: "12%", top: "22%", delay: "0s" },
    { left: "78%", top: "15%", delay: "1.2s" },
    { left: "35%", top: "68%", delay: "2.4s" },
    { left: "88%", top: "58%", delay: "0.6s" },
    { left: "55%", top: "35%", delay: "3s" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="rz-mist-drift absolute -left-1/4 top-1/4 h-[260px] w-[60%] rounded-full blur-3xl" style={{ background: tint }} />
      <div className="rz-mist-drift-rev absolute -right-1/4 bottom-1/4 h-[260px] w-[60%] rounded-full blur-3xl" style={{ background: tint }} />
      {dustPositions.map((p, i) => (
        <span
          key={i}
          className="rz-dust-twinkle absolute h-[3px] w-[3px] rounded-full bg-white"
          style={{ left: p.left, top: p.top, animationDelay: p.delay }}
        />
      ))}
    </div>
  );
}
