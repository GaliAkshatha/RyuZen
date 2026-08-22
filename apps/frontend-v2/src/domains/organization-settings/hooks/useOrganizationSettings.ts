import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { organizationSettingsService } from "@/domains/organization-settings/organizationSettingsService";
import type { OrganizationSettings } from "@/domains/organization-settings/organizationSettings.types";

export const ORG_SETTINGS_QUERY_KEY = ["organization-settings"] as const;

export function useOrganizationSettings() {
  return useApiQuery<OrganizationSettings>({ queryKey: ORG_SETTINGS_QUERY_KEY, queryFn: organizationSettingsService.get });
}
