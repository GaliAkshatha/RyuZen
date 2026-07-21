import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { departmentService } from "@/features/departments/services/department.service";
import { DEPARTMENTS_QUERY_KEY } from "@/features/departments/hooks/useDepartments";
import type {
  AssignHeadOfDepartmentPayload,
  DepartmentResponseDto,
} from "@/features/departments/types/department.types";

export function useAssignHod(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<DepartmentResponseDto, AssignHeadOfDepartmentPayload>({
    mutationFn: (payload) => departmentService.assignHead(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
      queryClient.setQueryData(["departments", id], updated);
    },
  });
}
