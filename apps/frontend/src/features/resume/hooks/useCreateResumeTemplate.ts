import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { resumeService } from "@/features/resume/services/resume.service";
import { RESUME_TEMPLATES_QUERY_KEY } from "@/features/resume/hooks/useResumeTemplates";
import type {
  CreateResumeTemplatePayload,
  ResumeTemplateResponseDto,
} from "@/features/resume/types/resume.types";

export function useCreateResumeTemplate() {
  const queryClient = useQueryClient();

  return useApiMutation<ResumeTemplateResponseDto, CreateResumeTemplatePayload>({
    mutationFn: resumeService.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_TEMPLATES_QUERY_KEY });
    },
  });
}
