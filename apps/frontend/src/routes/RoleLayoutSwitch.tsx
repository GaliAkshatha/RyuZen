import { useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { getLayoutForRole } from "@/shared/layout/getLayoutForRole";
import { resolvePortal } from "@/core/portal";

/**
 * Always mounts inside <ProtectedRoute>, which guarantees `user` is
 * non-null by the time this renders — this component's only job is
 * picking which of the 5 role layouts wraps the current route tree.
 *
 * Also sets `data-portal` on <html> via `resolvePortal(user.role)` —
 * a real, functioning seam for future portal-scoped styling or
 * analytics (e.g. `html[data-portal="platform"] { ... }`), not a
 * placeholder. No portal-specific CSS exists yet, so this has no
 * visible effect today.
 */
export function RoleLayoutSwitch() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      document.documentElement.dataset.portal = resolvePortal(user.role);
    }
  }, [user]);

  if (!user) return null;

  const Layout = getLayoutForRole(user.role);

  return <Layout />;
}
