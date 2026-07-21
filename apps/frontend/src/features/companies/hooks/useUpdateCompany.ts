import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { companyService } from "@/features/companies/services/company.service";
import { COMPANIES_QUERY_KEY } from "@/features/companies/hooks/useCompanies";
import type {
  CompanyResponseDto,
  UpdateCompanyPayload,
} from "@/features/companies/types/company.types";

export function useUpdateCompany(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<CompanyResponseDto, UpdateCompanyPayload>({
    mutationFn: (payload) => companyService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
      queryClient.setQueryData(["companies", id], updated);
    },
  });
}
