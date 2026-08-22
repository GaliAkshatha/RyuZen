import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { departmentService } from "@/domains/departments/departmentService";
import { DEPARTMENTS_QUERY_KEY } from "@/domains/departments/hooks/useDepartments";
import type { AssignHeadOfDepartmentRequest, Department } from "@/domains/departments/department.types";

export function useAssignHeadOfDepartment(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<Department, AssignHeadOfDepartmentRequest>({
    mutationFn: (payload) => departmentService.assignHead(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["departments", id] });
    },
  });
}
