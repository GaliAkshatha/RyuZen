import { useApiQuery } from "@/hooks/useApiQuery";

import { organizationSettingsService } from "@/features/organization-settings/services/organizationSettings.service";

export const ORGANIZATION_SETTINGS_QUERY_KEY = ["organization-settings"] as const;

export function useOrganizationSettings() {
  return useApiQuery({
    queryKey: ORGANIZATION_SETTINGS_QUERY_KEY,
    queryFn: organizationSettingsService.get,
  });
}
