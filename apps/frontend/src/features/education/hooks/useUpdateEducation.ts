import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { educationService } from "@/features/education/services/education.service";
import { MY_EDUCATION_QUERY_KEY } from "@/features/education/hooks/useMyEducation";
import type {
  EducationResponseDto,
  UpdateEducationPayload,
} from "@/features/education/types/education.types";

export function useUpdateEducation(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<EducationResponseDto, UpdateEducationPayload>({
    mutationFn: (payload) => educationService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: MY_EDUCATION_QUERY_KEY });
      queryClient.setQueryData(["education", id], updated);
    },
  });
}
