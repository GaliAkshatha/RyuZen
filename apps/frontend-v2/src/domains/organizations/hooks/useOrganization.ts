import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { organizationService } from "@/domains/organizations/organizationService";
import type { Organization } from "@/domains/organizations/organization.types";

export function useOrganization(id: string) {
  return useApiQuery<Organization>({
    queryKey: ["organizations", id] as const,
    queryFn: () => organizationService.getById(id),
    enabled: Boolean(id),
  });
}
