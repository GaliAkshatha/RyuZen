import { useApiMutation } from "@/hooks/useApiMutation";

import { resumeService } from "@/features/resume/services/resume.service";
import type { ResumeResponseDto } from "@/features/resume/types/resume.types";

export function useDownloadResume() {
  return useApiMutation<ResumeResponseDto, void>({
    mutationFn: resumeService.download,
  });
}
