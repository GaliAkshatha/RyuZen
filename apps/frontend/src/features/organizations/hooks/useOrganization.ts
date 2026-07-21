import { useApiQuery } from "@/hooks/useApiQuery";

import { organizationService } from "@/features/organizations/services/organization.service";

export function useOrganization(id: string) {
  return useApiQuery({
    queryKey: ["organizations", id] as const,
    queryFn: () => organizationService.getById(id),
    enabled: Boolean(id),
  });
}
