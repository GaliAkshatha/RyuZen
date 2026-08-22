import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { studentService } from "@/domains/students/studentService";
import type { Student } from "@/domains/students/student.types";

export const STUDENTS_QUERY_KEY = ["students"] as const;

export function useStudentList() {
  return useApiQuery<Student[]>({
    queryKey: STUDENTS_QUERY_KEY,
    queryFn: studentService.list,
  });
}
