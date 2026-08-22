import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { placementDriveService } from "@/domains/placement-drives/placementDriveService";
import { PLACEMENT_DRIVES_QUERY_KEY } from "@/domains/placement-drives/hooks/usePlacementDrives";
import type { CreatePlacementDriveRequest, PlacementDrive } from "@/domains/placement-drives/placementDrive.types";

export function useCreatePlacementDrive() {
  const queryClient = useQueryClient();
  return useApiMutation<PlacementDrive, CreatePlacementDriveRequest>({
    mutationFn: (payload) => placementDriveService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLACEMENT_DRIVES_QUERY_KEY });
    },
  });
}
