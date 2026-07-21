import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { companyService } from "@/features/companies/services/company.service";
import { COMPANIES_QUERY_KEY } from "@/features/companies/hooks/useCompanies";
import type {
  CompanyResponseDto,
  UpdateCompanyStatusPayload,
} from "@/features/companies/types/company.types";

export function useUpdateCompanyStatus(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<CompanyResponseDto, UpdateCompanyStatusPayload>({
    mutationFn: (payload) => companyService.updateStatus(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
      queryClient.setQueryData(["companies", id], updated);
    },
  });
}
