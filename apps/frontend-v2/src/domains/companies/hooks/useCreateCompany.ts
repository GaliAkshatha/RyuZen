import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { companyService } from "@/domains/companies/companyService";
import type { CreateCompanyRequest, Company } from "@/domains/companies/company.types";

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useApiMutation<Company, CreateCompanyRequest>({
    mutationFn: (payload) => companyService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}
