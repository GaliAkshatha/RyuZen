import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { companyService } from "@/features/companies/services/company.service";
import { COMPANIES_QUERY_KEY } from "@/features/companies/hooks/useCompanies";

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => companyService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
    },
  });
}
