import { useApiQuery } from "@/hooks/useApiQuery";

import { submissionService } from "@/features/submissions/services/submission.service";
import type { SubmissionListFilters } from "@/features/submissions/types/submission.types";

export const SUBMISSIONS_QUERY_KEY = ["submissions"] as const;

export function useSubmissions(filters?: SubmissionListFilters) {
  return useApiQuery({
    queryKey: [...SUBMISSIONS_QUERY_KEY, filters] as const,
    queryFn: () => submissionService.list(filters),
  });
}
