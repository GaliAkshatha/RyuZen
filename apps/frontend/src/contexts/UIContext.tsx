import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const SIDEBAR_STORAGE_KEY = "ryuzen-sidebar-collapsed";

interface UIContextValue {
  /** Desktop sidebar collapsed (icon-only) state — persisted, like theme preference. */
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  /** Mobile sidebar drawer open/closed — ephemeral, always starts closed. */
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  /** Notification drawer open/closed — ephemeral. Real content wired in CM1. */
  notificationDrawerOpen: boolean;
  setNotificationDrawerOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextValue | undefined>(undefined);

function readStoredSidebarCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readStoredSidebarCollapsed());
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((current) => !current);
  }, []);

  const value = useMemo<UIContextValue>(
    () => ({
      sidebarCollapsed,
      toggleSidebar,
      mobileSidebarOpen,
      setMobileSidebarOpen,
      notificationDrawerOpen,
      setNotificationDrawerOpen,
    }),
    [sidebarCollapsed, toggleSidebar, mobileSidebarOpen, notificationDrawerOpen],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- context + consumer hook co-location is the standard pattern for every context file in this project (see ThemeContext.tsx)
export function useUI(): UIContextValue {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useUI must be used within a UIProvider.");
  }

  return context;
}
