import { useApiQuery } from "@/hooks/useApiQuery";

import { jobApplicationService } from "@/features/job-applications/services/jobApplication.service";

export function useJobApplicationsForPlacement(placementId: string) {
  return useApiQuery({
    queryKey: ["job-applications", "placements", placementId] as const,
    queryFn: () => jobApplicationService.listForPlacement(placementId),
    enabled: Boolean(placementId),
  });
}
