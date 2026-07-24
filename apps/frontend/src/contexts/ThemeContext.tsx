import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { resolveTenant } from "@/core/tenant";

export type ThemeMode = "dark" | "light";

const STORAGE_KEY = "ryuzen-theme";

/**
 * Dark Fantasy Academy is the flagship experience, so the application
 * defaults to dark mode whenever no preference has been stored.
 *
 * This context's only real job is toggling the `.dark` class on
 * `<html>` and applying the current tenant's branding color
 * overrides, if any — every actual color value otherwise lives in
 * `styles/tokens.css` (the single, WCAG-AA-audited source of truth,
 * confirmed in H3) via CSS custom properties consumed through
 * Tailwind. There is deliberately no parallel theme-object system
 * here: an earlier experiment (`design/themes/*`) built one from a
 * second, disconnected hex color palette that nothing actually
 * applied — removed as part of the tenant/portal architecture cleanup
 * rather than completed, since it duplicated tokens.css without ever
 * driving real styles. `resolveTenant()`'s Default Tenant has no
 * overrides today, so this is a genuine no-op in production right
 * now — the override loop below is real, functioning code, not a
 * placeholder for later.
 */
const DEFAULT_MODE: ThemeMode = "dark";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") {
    return DEFAULT_MODE;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  return stored === "dark" || stored === "light" ? stored : DEFAULT_MODE;
}

function applyThemeClass(mode: ThemeMode): void {
  const root = window.document.documentElement;
  root.classList.toggle("dark", mode === "dark");
}

function applyTenantBrandingOverrides(): void {
  const tenant = resolveTenant();
  const overrides = tenant.branding.colorOverrides;

  if (!overrides) {
    return;
  }

  const root = window.document.documentElement;
  for (const [property, value] of Object.entries(overrides)) {
    root.style.setProperty(property, value);
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStoredMode());

  useEffect(() => {
    applyThemeClass(mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    applyTenantBrandingOverrides();
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, setMode, toggleMode }),
    [mode, setMode, toggleMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- context + consumer hook co-location is the standard pattern for every context file in this project
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }

  return context;
}