import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { educationService } from "@/features/education/services/education.service";
import { MY_EDUCATION_QUERY_KEY } from "@/features/education/hooks/useMyEducation";

export function useDeleteEducation() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => educationService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_EDUCATION_QUERY_KEY });
    },
  });
}
