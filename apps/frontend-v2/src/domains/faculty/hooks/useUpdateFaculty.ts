import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { facultyService } from "@/domains/faculty/facultyService";
import { FACULTY_QUERY_KEY } from "@/domains/faculty/hooks/useFacultyList";
import type { UpdateFacultyRequest, Faculty } from "@/domains/faculty/faculty.types";

export function useUpdateFaculty(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<Faculty, UpdateFacultyRequest>({
    mutationFn: (payload) => facultyService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["faculty", id] });
    },
  });
}
