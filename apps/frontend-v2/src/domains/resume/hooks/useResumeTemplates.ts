import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { resumeService } from "@/domains/resume/resumeService";
import type { ResumeTemplate } from "@/domains/resume/resume.types";

export function useResumeTemplates() {
  return useApiQuery<ResumeTemplate[]>({
    queryKey: ["resume", "templates"] as const,
    queryFn: resumeService.listTemplates,
  });
}
