import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { placementDriveService } from "@/features/placement-drives/services/placementDrive.service";
import { PLACEMENT_DRIVES_QUERY_KEY } from "@/features/placement-drives/hooks/usePlacementDrives";

export function useDeletePlacementDrive() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => placementDriveService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLACEMENT_DRIVES_QUERY_KEY });
    },
  });
}
