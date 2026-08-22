import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { submissionService } from "@/domains/submissions/submissionService";
import type { Submission } from "@/domains/submissions/submission.types";

export const MY_SUBMISSIONS_QUERY_KEY = ["submissions", "me"] as const;

export function useMySubmissions() {
  return useApiQuery<Submission[]>({ queryKey: MY_SUBMISSIONS_QUERY_KEY, queryFn: submissionService.listMine });
}
