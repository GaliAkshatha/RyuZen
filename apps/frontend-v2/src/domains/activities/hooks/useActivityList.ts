import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { activityService } from "@/domains/activities/activityService";
import type { Activity } from "@/domains/activities/activity.types";

export const ACTIVITIES_QUERY_KEY = ["activities"] as const;

export function useActivityList() {
  return useApiQuery<Activity[]>({
    queryKey: ACTIVITIES_QUERY_KEY,
    queryFn: activityService.list,
  });
}
