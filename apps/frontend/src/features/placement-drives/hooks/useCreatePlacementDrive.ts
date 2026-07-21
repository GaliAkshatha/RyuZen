import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { placementDriveService } from "@/features/placement-drives/services/placementDrive.service";
import { PLACEMENT_DRIVES_QUERY_KEY } from "@/features/placement-drives/hooks/usePlacementDrives";
import type {
  CreatePlacementDrivePayload,
  PlacementDriveResponseDto,
} from "@/features/placement-drives/types/placementDrive.types";

export function useCreatePlacementDrive() {
  const queryClient = useQueryClient();

  return useApiMutation<PlacementDriveResponseDto, CreatePlacementDrivePayload>({
    mutationFn: placementDriveService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLACEMENT_DRIVES_QUERY_KEY });
    },
  });
}
