import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { studentService } from "@/features/students/services/student.service";
import { STUDENTS_QUERY_KEY } from "@/features/students/hooks/useStudents";
import type {
  CreateStudentPayload,
  StudentResponseDto,
} from "@/features/students/types/student.types";

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useApiMutation<StudentResponseDto, CreateStudentPayload>({
    mutationFn: studentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
    },
  });
}
