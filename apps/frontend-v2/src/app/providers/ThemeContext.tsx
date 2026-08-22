import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type ThemeMode = "dark" | "light";
const STORAGE_KEY = "ryuzen.theme";

interface ThemeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
}

function applyThemeClass(mode: ThemeMode): void {
  document.documentElement.classList.toggle("light", mode === "light");
}

/** Defaults to dark - this is a platform used heavily at night by students, matching the token design. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => readStoredMode());

  useEffect(() => {
    applyThemeClass(mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  function toggleMode() {
    setMode((m) => (m === "dark" ? "light" : "dark"));
  }

  return <ThemeContext.Provider value={{ mode, toggleMode }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
