import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { activityService } from "@/features/activities/services/activity.service";
import { ACTIVITIES_QUERY_KEY } from "@/features/activities/hooks/useActivities";
import type { ActivityResponseDto } from "@/features/activities/types/activity.types";

export function useCloseActivity(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ActivityResponseDto, void>({
    mutationFn: () => activityService.close(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
      queryClient.setQueryData(["activities", id], updated);
    },
  });
}
