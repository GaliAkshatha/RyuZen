import { useApiQuery } from "@/hooks/useApiQuery";

import { activityService } from "@/features/activities/services/activity.service";

export function useActivity(id: string) {
  return useApiQuery({
    queryKey: ["activities", id] as const,
    queryFn: () => activityService.getById(id),
    enabled: Boolean(id),
  });
}
