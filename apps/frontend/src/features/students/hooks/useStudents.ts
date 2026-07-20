import { useApiQuery } from "@/hooks/useApiQuery";

import { studentService } from "@/features/students/services/student.service";

export const STUDENTS_QUERY_KEY = ["students"] as const;

export function useStudents() {
  return useApiQuery({
    queryKey: STUDENTS_QUERY_KEY,
    queryFn: studentService.list,
  });
}
