import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { activityService } from "@/features/activities/services/activity.service";
import { ACTIVITIES_QUERY_KEY } from "@/features/activities/hooks/useActivities";
import type {
  ActivityResponseDto,
  CreateActivityPayload,
} from "@/features/activities/types/activity.types";

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useApiMutation<ActivityResponseDto, CreateActivityPayload>({
    mutationFn: activityService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
    },
  });
}
