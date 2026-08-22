import { Navigate } from "react-router-dom";

import { useAuth } from "@/domains/auth/AuthContext";
import { getPortalPathForRole } from "@/app/router/getPortalPathForRole";

/**
 * Fixes a real bug caught before shipping: this sits inside
 * ProtectedRoute, so it only ever renders for an already-authenticated
 * user - redirecting it unconditionally to /login would have bounced
 * a genuinely logged-in user back to the login screen every time they
 * hit "/". Redirects to their real role's portal instead.
 */
export function PortalRedirect() {
  const { user } = useAuth();
  if (!user) return null;
  return <Navigate to={getPortalPathForRole(user.role)} replace />;
}
