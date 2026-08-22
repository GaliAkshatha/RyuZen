import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { studentService } from "@/domains/students/studentService";
import { STUDENTS_QUERY_KEY } from "@/domains/students/hooks/useStudentList";
import type { Student } from "@/domains/students/student.types";

export function usePromoteSemester() {
  const queryClient = useQueryClient();
  return useApiMutation<Student, string>({
    mutationFn: (id) => studentService.promoteSemester(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["students", id] });
    },
  });
}
