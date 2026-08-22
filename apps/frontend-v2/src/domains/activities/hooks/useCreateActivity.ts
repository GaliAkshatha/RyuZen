import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { activityService } from "@/domains/activities/activityService";
import { ACTIVITIES_QUERY_KEY } from "@/domains/activities/hooks/useActivityList";
import type { CreateActivityRequest, Activity } from "@/domains/activities/activity.types";

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useApiMutation<Activity, CreateActivityRequest>({
    mutationFn: (payload) => activityService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
    },
  });
}
