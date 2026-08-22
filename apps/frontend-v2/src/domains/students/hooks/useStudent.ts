import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { studentService } from "@/domains/students/studentService";
import type { Student } from "@/domains/students/student.types";

export function useStudent(id: string) {
  return useApiQuery<Student>({
    queryKey: ["students", id] as const,
    queryFn: () => studentService.getById(id),
    enabled: Boolean(id),
  });
}
