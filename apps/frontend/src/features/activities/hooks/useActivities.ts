import { useApiQuery } from "@/hooks/useApiQuery";

import { activityService } from "@/features/activities/services/activity.service";
import type { ActivityListFilters } from "@/features/activities/types/activity.types";

export const ACTIVITIES_QUERY_KEY = ["activities"] as const;

export function useActivities(filters?: ActivityListFilters) {
  return useApiQuery({
    queryKey: [...ACTIVITIES_QUERY_KEY, filters] as const,
    queryFn: () => activityService.list(filters),
  });
}
