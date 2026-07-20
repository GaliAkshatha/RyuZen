import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { resumeService } from "@/features/resume/services/resume.service";
import { RESUME_TEMPLATES_QUERY_KEY } from "@/features/resume/hooks/useResumeTemplates";

export function useDeleteResumeTemplate() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => resumeService.removeTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_TEMPLATES_QUERY_KEY });
    },
  });
}
