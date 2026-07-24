interface LevelProgressRingProps {
  level: number;
  progress: number;
  size?: number;
  label?: string;
}

/**
 * Circular progress indicator built from an SVG stroke-dashoffset
 * ring — no image/icon library dependency, themes automatically via
 * the existing color tokens. The number sits in the ring's center so
 * it reads as a single, immediate glance rather than a bar the user
 * has to interpret.
 *
 * Originally built for XP Level, `label` is intentionally generic so
 * Career Score reuses the identical visual language (see
 * CareerScoreWidget.tsx) — the same motif appearing for two different
 * numbers reinforces "one continuous experience" rather than each
 * feature inventing its own progress-indicator style.
 */
export function LevelProgressRing({ level, progress, size = 88, label = "Level" }: LevelProgressRingProps) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-700 motion-safe:ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl font-bold leading-none text-foreground">{level}</span>
        <span className="mt-0.5 font-body text-[10px] uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}
