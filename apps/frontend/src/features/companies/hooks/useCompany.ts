import { useApiQuery } from "@/hooks/useApiQuery";

import { companyService } from "@/features/companies/services/company.service";

export function useCompany(id: string) {
  return useApiQuery({
    queryKey: ["companies", id] as const,
    queryFn: () => companyService.getById(id),
    enabled: Boolean(id),
  });
}
