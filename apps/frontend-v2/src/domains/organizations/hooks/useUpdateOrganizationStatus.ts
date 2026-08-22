import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { organizationService } from "@/domains/organizations/organizationService";
import { ORGANIZATIONS_QUERY_KEY } from "@/domains/organizations/hooks/useOrganizations";
import type { UpdateOrganizationStatusRequest, Organization } from "@/domains/organizations/organization.types";

export function useUpdateOrganizationStatus(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<Organization, UpdateOrganizationStatusRequest>({
    mutationFn: (payload) => organizationService.updateStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["organizations", id] });
    },
  });
}
