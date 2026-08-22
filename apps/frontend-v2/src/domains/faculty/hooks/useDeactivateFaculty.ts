import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { facultyService } from "@/domains/faculty/facultyService";
import { FACULTY_QUERY_KEY } from "@/domains/faculty/hooks/useFacultyList";
import type { Faculty } from "@/domains/faculty/faculty.types";

export function useDeactivateFaculty() {
  const queryClient = useQueryClient();
  return useApiMutation<Faculty, string>({
    mutationFn: (id) => facultyService.deactivate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: FACULTY_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["faculty", id] });
    },
  });
}
