import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types/enums";

/**
 * Role gating for a specific route/subtree. Always nests inside
 * ProtectedRoute (assumes `user` is already non-null) — this component
 * does not itself check authentication.
 *
 * `allowedRoles` should be passed the exact same role list as the
 * matching entry in navRegistry.ts, so a role that can't see a section
 * in the sidebar also can't reach it by typing the URL directly.
 */
export function RoleRoute({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: ReactNode;
}) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
