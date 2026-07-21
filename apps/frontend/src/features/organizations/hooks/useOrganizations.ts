import { useApiQuery } from "@/hooks/useApiQuery";

import { organizationService } from "@/features/organizations/services/organization.service";

export const ORGANIZATIONS_QUERY_KEY = ["organizations"] as const;

export function useOrganizations() {
  return useApiQuery({
    queryKey: ORGANIZATIONS_QUERY_KEY,
    queryFn: organizationService.list,
  });
}
