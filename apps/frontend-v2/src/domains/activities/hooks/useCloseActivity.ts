import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { activityService } from "@/domains/activities/activityService";
import { ACTIVITIES_QUERY_KEY } from "@/domains/activities/hooks/useActivityList";
import type { Activity } from "@/domains/activities/activity.types";

export function useCloseActivity() {
  const queryClient = useQueryClient();
  return useApiMutation<Activity, string>({
    mutationFn: (id) => activityService.close(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["activities", id] });
    },
  });
}
