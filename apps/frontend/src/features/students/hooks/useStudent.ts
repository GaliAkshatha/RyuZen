import { useApiQuery } from "@/hooks/useApiQuery";

import { studentService } from "@/features/students/services/student.service";

export function useStudent(id: string) {
  return useApiQuery({
    queryKey: ["students", id] as const,
    queryFn: () => studentService.getById(id),
    enabled: Boolean(id),
  });
}
