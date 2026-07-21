import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { experienceService } from "@/features/experience/services/experience.service";
import { MY_EXPERIENCE_QUERY_KEY } from "@/features/experience/hooks/useMyExperience";
import type {
  ExperienceResponseDto,
  UpdateExperiencePayload,
} from "@/features/experience/types/experience.types";

export function useUpdateExperience(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ExperienceResponseDto, UpdateExperiencePayload>({
    mutationFn: (payload) => experienceService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: MY_EXPERIENCE_QUERY_KEY });
      queryClient.setQueryData(["experience", id], updated);
    },
  });
}
