import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { studentService } from "@/features/students/services/student.service";
import { STUDENTS_QUERY_KEY } from "@/features/students/hooks/useStudents";
import type {
  AssignMentorPayload,
  StudentResponseDto,
} from "@/features/students/types/student.types";

export function useAssignMentor(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<StudentResponseDto, AssignMentorPayload>({
    mutationFn: (payload) => studentService.assignMentor(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      queryClient.setQueryData(["students", id], updated);
    },
  });
}
