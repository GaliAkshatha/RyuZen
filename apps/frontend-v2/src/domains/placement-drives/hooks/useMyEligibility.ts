import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { placementDriveService } from "@/domains/placement-drives/placementDriveService";

export function useMyEligibility(driveId: string) {
  return useApiQuery<{ eligible: boolean; reasons: string[] }>({
    queryKey: ["placement-drives", driveId, "my-eligibility"] as const,
    queryFn: () => placementDriveService.checkMyEligibility(driveId),
    enabled: Boolean(driveId),
  });
}
