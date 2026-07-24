import { useTheme } from "@/contexts/ThemeContext";

/**
 * Minimal theme toggle for Milestone F2.
 *
 * This is deliberately a plain `<button>` styled only with the new
 * semantic Tailwind tokens — shadcn/ui's Button/Switch primitives don't
 * exist until F6 (Shared UI Primitives). F6 will relocate/restyle this
 * on top of the real Switch primitive once it exists; the public API
 * (`useTheme`) will not change, so nothing consuming this component
 * needs to be touched when that happens.
 */
export function ThemeToggle() {
  const { mode, toggleMode } = useTheme();

  const isDark = mode === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to Light Fantasy theme" : "Switch to Dark Fantasy Academy theme"}
      onClick={toggleMode}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-body text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span aria-hidden="true">{isDark ? "🌙" : "☀️"}</span>
      <span>{isDark ? "Dark Fantasy Academy" : "Light Fantasy"}</span>
    </button>
  );
}
