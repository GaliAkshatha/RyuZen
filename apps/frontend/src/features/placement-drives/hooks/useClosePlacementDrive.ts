import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { placementDriveService } from "@/features/placement-drives/services/placementDrive.service";
import { PLACEMENT_DRIVES_QUERY_KEY } from "@/features/placement-drives/hooks/usePlacementDrives";
import type { PlacementDriveResponseDto } from "@/features/placement-drives/types/placementDrive.types";

export function useClosePlacementDrive(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<PlacementDriveResponseDto, void>({
    mutationFn: () => placementDriveService.close(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: PLACEMENT_DRIVES_QUERY_KEY });
      queryClient.setQueryData(["placement-drives", id], updated);
    },
  });
}
