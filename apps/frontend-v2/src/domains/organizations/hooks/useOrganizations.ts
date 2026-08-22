import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { organizationService } from "@/domains/organizations/organizationService";
import type { Organization } from "@/domains/organizations/organization.types";

export const ORGANIZATIONS_QUERY_KEY = ["organizations"] as const;

export function useOrganizations() {
  return useApiQuery<Organization[]>({
    queryKey: ORGANIZATIONS_QUERY_KEY,
    queryFn: organizationService.list,
  });
}
