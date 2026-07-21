import { useApiQuery } from "@/hooks/useApiQuery";

import { departmentService } from "@/features/departments/services/department.service";

export function useDepartment(id: string) {
  return useApiQuery({
    queryKey: ["departments", id] as const,
    queryFn: () => departmentService.getById(id),
    enabled: Boolean(id),
  });
}
