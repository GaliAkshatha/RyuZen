import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { resumeService } from "@/features/resume/services/resume.service";
import { MY_RESUME_QUERY_KEY } from "@/features/resume/hooks/useMyResume";
import type {
  ResumeResponseDto,
  UpdateResumeVisibilityPayload,
} from "@/features/resume/types/resume.types";

export function useUpdateResumeVisibility() {
  const queryClient = useQueryClient();

  return useApiMutation<ResumeResponseDto, UpdateResumeVisibilityPayload>({
    mutationFn: resumeService.updateVisibility,
    onSuccess: (updated) => {
      queryClient.setQueryData(MY_RESUME_QUERY_KEY, updated);
    },
  });
}
