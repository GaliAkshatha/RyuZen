import { useApiQuery } from "@/hooks/useApiQuery";

import { placementDriveService } from "@/features/placement-drives/services/placementDrive.service";

export function usePlacementDrive(id: string) {
  return useApiQuery({
    queryKey: ["placement-drives", id] as const,
    queryFn: () => placementDriveService.getById(id),
    enabled: Boolean(id),
  });
}
