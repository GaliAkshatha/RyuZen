import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { activityService } from "@/features/activities/services/activity.service";
import { ACTIVITIES_QUERY_KEY } from "@/features/activities/hooks/useActivities";

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => activityService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
    },
  });
}
