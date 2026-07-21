import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { organizationService } from "@/features/organizations/services/organization.service";
import { ORGANIZATIONS_QUERY_KEY } from "@/features/organizations/hooks/useOrganizations";
import type {
  CreateOrganizationPayload,
  OrganizationResponseDto,
} from "@/features/organizations/types/organization.types";

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useApiMutation<OrganizationResponseDto, CreateOrganizationPayload>({
    mutationFn: organizationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_QUERY_KEY });
    },
  });
}
