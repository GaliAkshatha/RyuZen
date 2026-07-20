import { useApiQuery } from "@/hooks/useApiQuery";

import { resumeService } from "@/features/resume/services/resume.service";

export const RESUME_TEMPLATES_QUERY_KEY = ["resume", "templates"] as const;

export function useResumeTemplates() {
  return useApiQuery({
    queryKey: RESUME_TEMPLATES_QUERY_KEY,
    queryFn: resumeService.listTemplates,
  });
}
