import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { placementDriveService } from "@/domains/placement-drives/placementDriveService";
import type { PlacementDrive } from "@/domains/placement-drives/placementDrive.types";

export const PLACEMENT_DRIVES_QUERY_KEY = ["placement-drives"] as const;

export function usePlacementDrives() {
  return useApiQuery<PlacementDrive[]>({
    queryKey: PLACEMENT_DRIVES_QUERY_KEY,
    queryFn: placementDriveService.list,
  });
}
