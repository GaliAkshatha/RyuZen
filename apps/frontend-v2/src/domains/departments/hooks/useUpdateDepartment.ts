import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { departmentService } from "@/domains/departments/departmentService";
import { DEPARTMENTS_QUERY_KEY } from "@/domains/departments/hooks/useDepartments";
import type { UpdateDepartmentRequest, Department } from "@/domains/departments/department.types";

export function useUpdateDepartment(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<Department, UpdateDepartmentRequest>({
    mutationFn: (payload) => departmentService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["departments", id] });
    },
  });
}
