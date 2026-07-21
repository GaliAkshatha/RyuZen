import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { organizationSettingsService } from "@/features/organization-settings/services/organizationSettings.service";
import { ORGANIZATION_SETTINGS_QUERY_KEY } from "@/features/organization-settings/hooks/useOrganizationSettings";
import type {
  OrganizationSettingsResponseDto,
  UpdateOrganizationSettingsPayload,
} from "@/features/organization-settings/types/organizationSettings.types";

export function useUpdateOrganizationSettings() {
  const queryClient = useQueryClient();

  return useApiMutation<OrganizationSettingsResponseDto, UpdateOrganizationSettingsPayload>({
    mutationFn: organizationSettingsService.update,
    onSuccess: (updated) => {
      queryClient.setQueryData(ORGANIZATION_SETTINGS_QUERY_KEY, updated);
    },
  });
}
