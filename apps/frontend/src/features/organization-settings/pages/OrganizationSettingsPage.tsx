import { useState } from "react";
import { Settings } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";

import { useOrganizationSettings } from "@/features/organization-settings/hooks/useOrganizationSettings";
import { SettingsCategorySection } from "@/features/organization-settings/components/SettingsCategorySection";
import { SETTINGS_CATEGORIES } from "@/features/organization-settings/config/settingsFieldConfig";
import type { OrganizationSettingsCategory } from "@/features/organization-settings/types/organizationSettings.types";

export function OrganizationSettingsPage() {
  const { data: settings, isLoading, isError, error, refetch } = useOrganizationSettings();
  const [activeCategory, setActiveCategory] = useState<OrganizationSettingsCategory>("branding");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !settings) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const activeConfig = SETTINGS_CATEGORIES.find((c) => c.category === activeCategory);

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <Settings className="h-6 w-6 text-primary" aria-hidden="true" />
          Organization Settings
        </h1>
        <Select
          value={activeCategory}
          onValueChange={(v) => setActiveCategory(v as OrganizationSettingsCategory)}
        >
          <SelectTrigger className="w-52" aria-label="Select settings category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SETTINGS_CATEGORIES.map((c) => (
              <SelectItem key={c.category} value={c.category}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeConfig && (
        <SettingsCategorySection
          key={activeConfig.category}
          config={activeConfig}
          values={settings[activeConfig.category]}
        />
      )}
    </div>
  );
}
