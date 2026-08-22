import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { activityService } from "@/domains/activities/activityService";
import { ACTIVITIES_QUERY_KEY } from "@/domains/activities/hooks/useActivityList";

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useApiMutation<void, string>({
    mutationFn: (id) => activityService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
    },
  });
}
