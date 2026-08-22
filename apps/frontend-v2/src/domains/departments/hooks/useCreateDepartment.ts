import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { departmentService } from "@/domains/departments/departmentService";
import { DEPARTMENTS_QUERY_KEY } from "@/domains/departments/hooks/useDepartments";
import type { CreateDepartmentRequest, Department } from "@/domains/departments/department.types";

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useApiMutation<Department, CreateDepartmentRequest>({
    mutationFn: (payload) => departmentService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
    },
  });
}
