import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { resumeService } from "@/features/resume/services/resume.service";
import { RESUME_TEMPLATES_QUERY_KEY } from "@/features/resume/hooks/useResumeTemplates";
import type {
  ResumeTemplateResponseDto,
  UpdateResumeTemplatePayload,
} from "@/features/resume/types/resume.types";

export function useUpdateResumeTemplate(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ResumeTemplateResponseDto, UpdateResumeTemplatePayload>({
    mutationFn: (payload) => resumeService.updateTemplate(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: RESUME_TEMPLATES_QUERY_KEY });
      queryClient.setQueryData(["resume", "templates", id], updated);
    },
  });
}
