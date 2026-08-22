import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { studentService } from "@/domains/students/studentService";
import { STUDENTS_QUERY_KEY } from "@/domains/students/hooks/useStudentList";
import type { CreateStudentRequest, Student } from "@/domains/students/student.types";

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useApiMutation<Student, CreateStudentRequest>({
    mutationFn: (payload) => studentService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
    },
  });
}
