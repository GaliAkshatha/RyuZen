import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { submissionService } from "@/domains/submissions/submissionService";
import type { Submission } from "@/domains/submissions/submission.types";

export function useSubmissionsForActivity(activityId: string) {
  return useApiQuery<Submission[]>({
    queryKey: ["submissions", "activity", activityId] as const,
    queryFn: () => submissionService.listForActivity(activityId),
    enabled: Boolean(activityId),
  });
}
