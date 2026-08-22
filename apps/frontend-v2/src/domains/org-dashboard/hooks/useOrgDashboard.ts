import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { orgDashboardService } from "@/domains/org-dashboard/orgDashboardService";
import type { OrgDashboard } from "@/domains/org-dashboard/orgDashboard.types";

export function useOrgDashboard() {
  return useApiQuery<OrgDashboard>({
    queryKey: ["org-dashboard"] as const,
    queryFn: orgDashboardService.get,
  });
}
