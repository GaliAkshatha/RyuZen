import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { activityService } from "@/domains/activities/activityService";
import type { Activity } from "@/domains/activities/activity.types";

export function useActivity(id: string) {
  return useApiQuery<Activity>({
    queryKey: ["activities", id] as const,
    queryFn: () => activityService.getById(id),
    enabled: Boolean(id),
  });
}
