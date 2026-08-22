import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { departmentService } from "@/domains/departments/departmentService";
import type { Department } from "@/domains/departments/department.types";

export const DEPARTMENTS_QUERY_KEY = ["departments"] as const;

export function useDepartments() {
  return useApiQuery<Department[]>({
    queryKey: DEPARTMENTS_QUERY_KEY,
    queryFn: departmentService.list,
  });
}
