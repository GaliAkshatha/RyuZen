import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { studentService } from "@/features/students/services/student.service";
import { STUDENTS_QUERY_KEY } from "@/features/students/hooks/useStudents";
import type {
  StudentResponseDto,
  UpdateStudentPayload,
} from "@/features/students/types/student.types";

export function useUpdateStudent(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<StudentResponseDto, UpdateStudentPayload>({
    mutationFn: (payload) => studentService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      queryClient.setQueryData(["students", id], updated);
    },
  });
}
