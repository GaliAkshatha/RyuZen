import { useApiQuery } from "@/hooks/useApiQuery";

import { adminDashboardService } from "@/features/admin-dashboard/services/adminDashboard.service";

export const ADMIN_DASHBOARD_QUERY_KEY = ["admin-dashboard"] as const;

/** GetDashboardUseCase caches server-side for 60s (DASHBOARD_CACHE_TTL_SECONDS, confirmed in source) — matching client staleTime avoids a refetch the backend would just serve from its own cache anyway (H4). */
export function useAdminDashboard() {
  return useApiQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY,
    queryFn: adminDashboardService.get,
    staleTime: 60 * 1000,
  });
}
