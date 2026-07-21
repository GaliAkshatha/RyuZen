import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { companyService } from "@/features/companies/services/company.service";
import { COMPANIES_QUERY_KEY } from "@/features/companies/hooks/useCompanies";
import type {
  CompanyResponseDto,
  CreateCompanyPayload,
} from "@/features/companies/types/company.types";

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useApiMutation<CompanyResponseDto, CreateCompanyPayload>({
    mutationFn: companyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
    },
  });
}
