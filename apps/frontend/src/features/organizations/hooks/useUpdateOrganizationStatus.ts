import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { organizationService } from "@/features/organizations/services/organization.service";
import { ORGANIZATIONS_QUERY_KEY } from "@/features/organizations/hooks/useOrganizations";
import type {
  OrganizationResponseDto,
  UpdateOrganizationStatusPayload,
} from "@/features/organizations/types/organization.types";

export function useUpdateOrganizationStatus(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<OrganizationResponseDto, UpdateOrganizationStatusPayload>({
    mutationFn: (payload) => organizationService.updateStatus(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_QUERY_KEY });
      queryClient.setQueryData(["organizations", id], updated);
    },
  });
}
