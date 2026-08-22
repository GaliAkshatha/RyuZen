import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { resumeService } from "@/domains/resume/resumeService";
import type { Resume } from "@/domains/resume/resume.types";

export function useResumeForCandidate(userId: string) {
  return useApiQuery<Resume>({
    queryKey: ["resume", "candidate", userId] as const,
    queryFn: () => resumeService.getForCandidate(userId),
    enabled: Boolean(userId),
    retry: false,
  });
}
