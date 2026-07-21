import { useApiQuery } from "@/hooks/useApiQuery";

import { resumeService } from "@/features/resume/services/resume.service";

export const RESUME_TEMPLATES_QUERY_KEY = ["resume", "templates"] as const;

/** Resume templates are a global, rarely-changing catalog — GetResumeTemplatesUseCase caches server-side for 300s (confirmed in source), so a matching client staleTime avoids refetching data the backend itself hasn't recomputed (H4). */
export function useResumeTemplates() {
  return useApiQuery({
    queryKey: RESUME_TEMPLATES_QUERY_KEY,
    queryFn: resumeService.listTemplates,
    staleTime: 5 * 60 * 1000,
  });
}
