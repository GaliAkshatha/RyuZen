import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { facultyService } from "@/features/faculty/services/faculty.service";
import { FACULTY_QUERY_KEY } from "@/features/faculty/hooks/useFaculty";
import type { FacultyResponseDto } from "@/features/faculty/types/faculty.types";

export function useDeactivateFaculty(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<FacultyResponseDto, void>({
    mutationFn: () => facultyService.deactivate(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEY });
      queryClient.setQueryData(["faculty", id], updated);
    },
  });
}
