import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { experienceService } from "@/features/experience/services/experience.service";
import { MY_EXPERIENCE_QUERY_KEY } from "@/features/experience/hooks/useMyExperience";

export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => experienceService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_EXPERIENCE_QUERY_KEY });
    },
  });
}
