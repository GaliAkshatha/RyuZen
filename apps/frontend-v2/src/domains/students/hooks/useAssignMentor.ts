import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { studentService } from "@/domains/students/studentService";
import { STUDENTS_QUERY_KEY } from "@/domains/students/hooks/useStudentList";
import type { AssignMentorRequest, Student } from "@/domains/students/student.types";

export function useAssignMentor(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<Student, AssignMentorRequest>({
    mutationFn: (payload) => studentService.assignMentor(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["students", id] });
    },
  });
}
