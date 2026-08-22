import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { organizationSettingsService } from "@/domains/organization-settings/organizationSettingsService";
import { ORG_SETTINGS_QUERY_KEY } from "@/domains/organization-settings/hooks/useOrganizationSettings";
import type {
  OrganizationSettings,
  UpdateOrganizationSettingsRequest,
} from "@/domains/organization-settings/organizationSettings.types";

export function useUpdateOrganizationSettings() {
  const queryClient = useQueryClient();
  return useApiMutation<OrganizationSettings, UpdateOrganizationSettingsRequest>({
    mutationFn: (payload) => organizationSettingsService.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ORG_SETTINGS_QUERY_KEY }),
  });
}
