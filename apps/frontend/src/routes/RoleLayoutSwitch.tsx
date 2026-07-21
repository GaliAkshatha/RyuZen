import { useAuth } from "@/contexts/AuthContext";
import { getLayoutForRole } from "@/layouts/getLayoutForRole";

/**
 * Always mounts inside <ProtectedRoute>, which guarantees `user` is
 * non-null by the time this renders — this component's only job is
 * picking which of the 5 role layouts wraps the current route tree.
 */
export function RoleLayoutSwitch() {
  const { user } = useAuth();

  if (!user) return null;

  const Layout = getLayoutForRole(user.role);

  return <Layout />;
}
