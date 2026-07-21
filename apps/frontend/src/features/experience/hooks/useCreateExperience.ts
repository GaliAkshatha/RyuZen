import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { experienceService } from "@/features/experience/services/experience.service";
import { MY_EXPERIENCE_QUERY_KEY } from "@/features/experience/hooks/useMyExperience";
import type {
  CreateExperiencePayload,
  ExperienceResponseDto,
} from "@/features/experience/types/experience.types";

export function useCreateExperience() {
  const queryClient = useQueryClient();

  return useApiMutation<ExperienceResponseDto, CreateExperiencePayload>({
    mutationFn: experienceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_EXPERIENCE_QUERY_KEY });
    },
  });
}
