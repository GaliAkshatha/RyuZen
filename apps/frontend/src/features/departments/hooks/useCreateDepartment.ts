import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { departmentService } from "@/features/departments/services/department.service";
import { DEPARTMENTS_QUERY_KEY } from "@/features/departments/hooks/useDepartments";
import type {
  CreateDepartmentPayload,
  DepartmentResponseDto,
} from "@/features/departments/types/department.types";

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useApiMutation<DepartmentResponseDto, CreateDepartmentPayload>({
    mutationFn: departmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
    },
  });
}
