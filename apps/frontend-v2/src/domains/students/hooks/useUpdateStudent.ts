import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { studentService } from "@/domains/students/studentService";
import { STUDENTS_QUERY_KEY } from "@/domains/students/hooks/useStudentList";
import type { UpdateStudentRequest, Student } from "@/domains/students/student.types";

export function useUpdateStudent(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<Student, UpdateStudentRequest>({
    mutationFn: (payload) => studentService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["students", id] });
    },
  });
}
