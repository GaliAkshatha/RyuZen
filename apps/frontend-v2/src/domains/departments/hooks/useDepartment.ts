import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { departmentService } from "@/domains/departments/departmentService";
import type { Department } from "@/domains/departments/department.types";

export function useDepartment(id: string) {
  return useApiQuery<Department>({
    queryKey: ["departments", id] as const,
    queryFn: () => departmentService.getById(id),
    enabled: Boolean(id),
  });
}
