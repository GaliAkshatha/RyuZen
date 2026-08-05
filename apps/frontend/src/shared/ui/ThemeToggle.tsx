import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/contexts/ThemeContext";

/**
 * Icon-only theme toggle. The theme's internal name ("Dark Fantasy
 * Academy" / "Light Fantasy") is real product vocabulary for design
 * docs, not user-facing button copy - it stays in the aria-label for
 * screen readers, but the visible control is just the icon a person
 * actually expects on a light/dark switch.
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
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggleMode}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {isDark ? (
        <Moon className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Sun className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
