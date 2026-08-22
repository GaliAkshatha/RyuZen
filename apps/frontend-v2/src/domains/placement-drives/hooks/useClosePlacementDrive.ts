import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { placementDriveService } from "@/domains/placement-drives/placementDriveService";
import { PLACEMENT_DRIVES_QUERY_KEY } from "@/domains/placement-drives/hooks/usePlacementDrives";
import type { PlacementDrive } from "@/domains/placement-drives/placementDrive.types";

export function useClosePlacementDrive() {
  const queryClient = useQueryClient();
  return useApiMutation<PlacementDrive, string>({
    mutationFn: (id) => placementDriveService.close(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: PLACEMENT_DRIVES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["placement-drives", id] });
    },
  });
}
