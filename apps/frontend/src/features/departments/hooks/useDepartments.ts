import { useApiQuery } from "@/hooks/useApiQuery";

import { departmentService } from "@/features/departments/services/department.service";

export const DEPARTMENTS_QUERY_KEY = ["departments"] as const;

export function useDepartments() {
  return useApiQuery({
    queryKey: DEPARTMENTS_QUERY_KEY,
    queryFn: departmentService.list,
  });
}
