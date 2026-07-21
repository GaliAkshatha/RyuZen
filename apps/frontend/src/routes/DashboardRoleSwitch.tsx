import { useAuth } from "@/contexts/AuthContext";
import { getDashboardForRole } from "@/features/dashboard/getDashboardForRole";

/**
 * Mounts at /app/dashboard (always inside ProtectedRoute, so `user` is
 * guaranteed non-null). Same pattern as RoleLayoutSwitch (F8).
 */
export function DashboardRoleSwitch() {
  const { user } = useAuth();

  if (!user) return null;

  const Dashboard = getDashboardForRole(user.role);

  return <Dashboard />;
}
