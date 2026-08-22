import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { activityService } from "@/domains/activities/activityService";
import { ACTIVITIES_QUERY_KEY } from "@/domains/activities/hooks/useActivityList";
import type { UpdateActivityRequest, Activity } from "@/domains/activities/activity.types";

export function useUpdateActivity(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<Activity, UpdateActivityRequest>({
    mutationFn: (payload) => activityService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["activities", id] });
    },
  });
}
