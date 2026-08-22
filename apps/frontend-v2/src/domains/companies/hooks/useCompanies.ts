import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { companyService } from "@/domains/companies/companyService";
import type { Company } from "@/domains/companies/company.types";

export function useCompanies() {
  return useApiQuery<Company[]>({
    queryKey: ["companies"] as const,
    queryFn: companyService.list,
  });
}
