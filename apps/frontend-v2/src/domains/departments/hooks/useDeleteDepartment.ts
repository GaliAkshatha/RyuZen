import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { departmentService } from "@/domains/departments/departmentService";
import { DEPARTMENTS_QUERY_KEY } from "@/domains/departments/hooks/useDepartments";

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useApiMutation<void, string>({
    mutationFn: (id) => departmentService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPARTMENTS_QUERY_KEY });
    },
  });
}
