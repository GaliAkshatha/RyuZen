import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { facultyService } from "@/domains/faculty/facultyService";
import { FACULTY_QUERY_KEY } from "@/domains/faculty/hooks/useFacultyList";
import type { CreateFacultyRequest, Faculty } from "@/domains/faculty/faculty.types";

export function useCreateFaculty() {
  const queryClient = useQueryClient();
  return useApiMutation<Faculty, CreateFacultyRequest>({
    mutationFn: (payload) => facultyService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEY });
    },
  });
}
