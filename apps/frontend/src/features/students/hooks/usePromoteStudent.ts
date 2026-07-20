import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { studentService } from "@/features/students/services/student.service";
import { STUDENTS_QUERY_KEY } from "@/features/students/hooks/useStudents";
import type { StudentResponseDto } from "@/features/students/types/student.types";

export function usePromoteStudent(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<StudentResponseDto, void>({
    mutationFn: () => studentService.promote(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      queryClient.setQueryData(["students", id], updated);
    },
  });
}
