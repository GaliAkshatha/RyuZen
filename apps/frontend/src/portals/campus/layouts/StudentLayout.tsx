import { AppShell } from "@/layouts/AppShell";

/**
 * AppShell already adapts fully to the current user's role (nav
 * filtering via AppSidebar, topbar content) by reading AuthContext
 * directly — this file exists as a named, stable mounting point in the
 * router (per F8's explicit "one file per layout" deliverable) and as
 * a home for any future student-specific chrome, without needing to
 * restructure the router if that need arises later.
 */
export function StudentLayout() {
  return <AppShell />;
}
