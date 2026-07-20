import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { departmentService } from "@/features/departments/services/department.service";
import { DEPARTMENTS_QUERY_KEY } from "@/features/departments/hooks/useDepartments";

export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => departmentService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
    },
  });
}
