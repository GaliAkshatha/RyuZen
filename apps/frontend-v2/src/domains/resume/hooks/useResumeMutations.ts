import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { resumeService } from "@/domains/resume/resumeService";
import { MY_RESUME_QUERY_KEY } from "@/domains/resume/hooks/useMyResume";
import type { Resume, GenerateResumeRequest, UpdateResumeVisibilityRequest } from "@/domains/resume/resume.types";

export function useGenerateResume() {
  const queryClient = useQueryClient();
  return useApiMutation<Resume, GenerateResumeRequest>({
    mutationFn: (payload) => resumeService.generate(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_RESUME_QUERY_KEY }),
  });
}

export function useUpdateResumeVisibility() {
  const queryClient = useQueryClient();
  return useApiMutation<Resume, UpdateResumeVisibilityRequest>({
    mutationFn: (payload) => resumeService.updateVisibility(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MY_RESUME_QUERY_KEY }),
  });
}
