import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { placementDriveService } from "@/features/placement-drives/services/placementDrive.service";
import { PLACEMENT_DRIVES_QUERY_KEY } from "@/features/placement-drives/hooks/usePlacementDrives";
import type {
  PlacementDriveResponseDto,
  UpdatePlacementDrivePayload,
} from "@/features/placement-drives/types/placementDrive.types";

export function useUpdatePlacementDrive(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<PlacementDriveResponseDto, UpdatePlacementDrivePayload>({
    mutationFn: (payload) => placementDriveService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: PLACEMENT_DRIVES_QUERY_KEY });
      queryClient.setQueryData(["placement-drives", id], updated);
    },
  });
}
