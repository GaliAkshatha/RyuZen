import { Outlet } from "react-router-dom";

/**
 * Minimal Phase 1 placeholder - a real sidebar/topbar per role is
 * genuinely role-specific work (Phase 3 onward, one portal at a
 * time), not shared foundation. This exists only so routing/auth can
 * be proven end-to-end before any portal is built.
 */
export function AppShell() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Outlet />
    </div>
  );
}
