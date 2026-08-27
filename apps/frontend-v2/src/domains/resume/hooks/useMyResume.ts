import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { resumeService } from "@/domains/resume/resumeService";
import type { Resume } from "@/domains/resume/resume.types";

export const MY_RESUME_QUERY_KEY = ["resume", "me"] as const;

export function useMyResume() {
  return useApiQuery<Resume | null>({
    queryKey: MY_RESUME_QUERY_KEY,
    queryFn: resumeService.getMine,
  });
}
