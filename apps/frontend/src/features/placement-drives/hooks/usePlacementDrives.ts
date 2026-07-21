import { useApiQuery } from "@/hooks/useApiQuery";

import { placementDriveService } from "@/features/placement-drives/services/placementDrive.service";

export const PLACEMENT_DRIVES_QUERY_KEY = ["placement-drives"] as const;

export function usePlacementDrives() {
  return useApiQuery({
    queryKey: PLACEMENT_DRIVES_QUERY_KEY,
    queryFn: placementDriveService.list,
  });
}
