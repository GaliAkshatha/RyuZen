import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/domains/auth/AuthContext";
import { hasAnyRole } from "@/shared/utils/rbac";
import type { UserRole } from "@/shared/types/enums";

/**
 * Frontend role boundary - UX only, per the standing security
 * principle: the backend's own authorizePermission middleware remains
 * the real, authoritative check on every request regardless of what
 * this component allows through.
 */
export function RoleRoute({ allowedRoles, children }: { allowedRoles: UserRole[]; children: ReactNode }) {
  const { user } = useAuth();

  if (!hasAnyRole(user?.role, allowedRoles)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
