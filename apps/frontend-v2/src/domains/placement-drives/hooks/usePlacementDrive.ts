import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { placementDriveService } from "@/domains/placement-drives/placementDriveService";
import type { PlacementDrive } from "@/domains/placement-drives/placementDrive.types";

export function usePlacementDrive(id: string) {
  return useApiQuery<PlacementDrive>({
    queryKey: ["placement-drives", id] as const,
    queryFn: () => placementDriveService.getById(id),
    enabled: Boolean(id),
  });
}
