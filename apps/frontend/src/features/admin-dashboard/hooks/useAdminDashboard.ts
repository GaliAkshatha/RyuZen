import { useApiQuery } from "@/hooks/useApiQuery";

import { adminDashboardService } from "@/features/admin-dashboard/services/adminDashboard.service";

export const ADMIN_DASHBOARD_QUERY_KEY = ["admin-dashboard"] as const;

export function useAdminDashboard() {
  return useApiQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY,
    queryFn: adminDashboardService.get,
  });
}
