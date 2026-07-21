import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

/**
 * Gates the entire `/app/*` subtree on authentication only — role
 * gating is a separate concern, handled by RoleRoute for the specific
 * sub-paths that need it.
 *
 * Waits for `isInitializing` to resolve before deciding anything: if we
 * redirect to /login while AuthContext is still checking a stored
 * token, a user with a perfectly valid session would flash through the
 * login page on every page reload.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
