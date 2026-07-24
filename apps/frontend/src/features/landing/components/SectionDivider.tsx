/**
 * A quiet connective thread between sections — a vertical gradient
 * line with a single glowing node — so consecutive sections read as
 * one continuous descent through the story rather than independently
 * stacked blocks. Deliberately minimal: this is the seam, not a
 * decoration competing for attention.
 */
export function SectionDivider() {
  return (
    <div className="relative mx-auto h-16 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" aria-hidden="true">
      <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary motion-safe:animate-twinkle" />
    </div>
  );
}
