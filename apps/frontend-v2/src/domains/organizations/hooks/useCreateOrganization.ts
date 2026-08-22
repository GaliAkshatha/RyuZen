import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { organizationService } from "@/domains/organizations/organizationService";
import { ORGANIZATIONS_QUERY_KEY } from "@/domains/organizations/hooks/useOrganizations";
import type { CreateOrganizationRequest, Organization } from "@/domains/organizations/organization.types";

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useApiMutation<Organization, CreateOrganizationRequest>({
    mutationFn: (payload) => organizationService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_QUERY_KEY });
    },
  });
}
