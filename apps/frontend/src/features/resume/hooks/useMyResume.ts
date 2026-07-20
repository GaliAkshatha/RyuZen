import { useApiQuery } from "@/hooks/useApiQuery";

import { resumeService } from "@/features/resume/services/resume.service";

export const MY_RESUME_QUERY_KEY = ["resume", "mine"] as const;

/**
 * GetMyResumeUseCase throws a 404 "You have not generated a resume
 * yet." for a brand-new user — this is an EXPECTED state, not an
 * error, so the page checks `error?.status === 404` to distinguish
 * "no resume yet" from a genuine failure, rather than showing a
 * generic ErrorState.
 */
export function useMyResume() {
  return useApiQuery({
    queryKey: MY_RESUME_QUERY_KEY,
    queryFn: resumeService.getMine,
    retry: false,
  });
}
