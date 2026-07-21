import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { educationService } from "@/features/education/services/education.service";
import { MY_EDUCATION_QUERY_KEY } from "@/features/education/hooks/useMyEducation";
import type {
  CreateEducationPayload,
  EducationResponseDto,
} from "@/features/education/types/education.types";

export function useCreateEducation() {
  const queryClient = useQueryClient();

  return useApiMutation<EducationResponseDto, CreateEducationPayload>({
    mutationFn: educationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_EDUCATION_QUERY_KEY });
    },
  });
}
