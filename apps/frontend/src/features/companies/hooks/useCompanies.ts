import { useApiQuery } from "@/hooks/useApiQuery";

import { companyService } from "@/features/companies/services/company.service";

export const COMPANIES_QUERY_KEY = ["companies"] as const;

export function useCompanies() {
  return useApiQuery({
    queryKey: COMPANIES_QUERY_KEY,
    queryFn: companyService.list,
  });
}
