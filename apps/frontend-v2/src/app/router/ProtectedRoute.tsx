import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/domains/auth/AuthContext";
import { Spinner } from "@/shared/components/Spinner";

/**
 * Real auth boundary - while session resolution is in flight (see
 * AuthProvider's effect), shows a spinner rather than redirecting
 * prematurely, which would bounce a genuinely-logged-in user back to
 * /login on every reload before their session has a chance to
 * resolve.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
