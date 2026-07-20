import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { activityService } from "@/features/activities/services/activity.service";
import { ACTIVITIES_QUERY_KEY } from "@/features/activities/hooks/useActivities";
import type {
  ActivityResponseDto,
  UpdateActivityPayload,
} from "@/features/activities/types/activity.types";

export function useUpdateActivity(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ActivityResponseDto, UpdateActivityPayload>({
    mutationFn: (payload) => activityService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
      queryClient.setQueryData(["activities", id], updated);
    },
  });
}
