import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { facultyService } from "@/domains/faculty/facultyService";
import { FACULTY_QUERY_KEY } from "@/domains/faculty/hooks/useFacultyList";
import type { AssignFacultyDepartmentRequest, Faculty } from "@/domains/faculty/faculty.types";

export function useAssignFacultyDepartment(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<Faculty, AssignFacultyDepartmentRequest>({
    mutationFn: (payload) => facultyService.assignDepartment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["faculty", id] });
    },
  });
}
