import { useApiQuery } from "@/hooks/useApiQuery";

import { submissionService } from "@/features/submissions/services/submission.service";

export function useSubmission(id: string) {
  return useApiQuery({
    queryKey: ["submissions", id] as const,
    queryFn: () => submissionService.getById(id),
    enabled: Boolean(id),
  });
}
