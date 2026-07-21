import { useState } from "react";
import { Save } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Switch } from "@/shared/ui/Switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { useToast } from "@/hooks/useToast";

import { useUpdateOrganizationSettings } from "@/features/organization-settings/hooks/useUpdateOrganizationSettings";
import type { SettingsCategoryConfig } from "@/features/organization-settings/config/settingsFieldConfig";

// The category's value object is a heterogeneous record of primitives/arrays; a generic,
// config-driven renderer necessarily works with loosely-typed field values here.
type CategoryValue = Record<string, unknown>;

interface SettingsCategorySectionProps {
  config: SettingsCategoryConfig;
  values: CategoryValue;
}

/**
 * Renders one settings category generically from `settingsFieldConfig`
 * — this single component handles all ~70 leaf fields across 17
 * categories, rather than 70 hand-written field blocks. Each category
 * saves independently (only that category's object is sent in the
 * PATCH payload), so a mistake in one section never risks the others.
 */
export function SettingsCategorySection({ config, values }: SettingsCategorySectionProps) {
  const { toast } = useToast();
  const { mutate, isPending } = useUpdateOrganizationSettings();
  const [draft, setDraft] = useState<CategoryValue>(values);

  const setField = (key: string, value: unknown) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.label}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {config.fields.map((field) => {
          const fieldId = `${config.category}-${field.key}`;
          const value = draft[field.key];

          if (field.type === "boolean") {
            return (
              <div key={field.key} className="flex items-center justify-between gap-2">
                <label htmlFor={fieldId} className="font-body text-sm text-foreground">
                  {field.label}
                </label>
                <Switch
                  id={fieldId}
                  checked={Boolean(value)}
                  onCheckedChange={(checked) => setField(field.key, checked)}
                />
              </div>
            );
          }

          if (field.type === "enum") {
            return (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label htmlFor={fieldId} className="font-body text-sm text-foreground">
                  {field.label}
                </label>
                <Select value={String(value ?? "")} onValueChange={(v) => setField(field.key, v)}>
                  <SelectTrigger id={fieldId} aria-label={field.label}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {field.enumOptions?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          if (field.type === "number") {
            return (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label htmlFor={fieldId} className="font-body text-sm text-foreground">
                  {field.label}
                </label>
                <Input
                  id={fieldId}
                  type="number"
                  value={typeof value === "number" ? value : ""}
                  onChange={(e) =>
                    setField(field.key, e.target.value === "" ? undefined : Number(e.target.value))
                  }
                />
              </div>
            );
          }

          if (field.type === "string[]") {
            const arrayValue = Array.isArray(value) ? (value as string[]) : [];
            return (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label htmlFor={fieldId} className="font-body text-sm text-foreground">
                  {field.label}
                </label>
                <Input
                  id={fieldId}
                  value={arrayValue.join(", ")}
                  onChange={(e) =>
                    setField(
                      field.key,
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </div>
            );
          }

          return (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label htmlFor={fieldId} className="font-body text-sm text-foreground">
                {field.label}
              </label>
              <Input
                id={fieldId}
                value={typeof value === "string" ? value : ""}
                onChange={(e) => setField(field.key, e.target.value)}
              />
            </div>
          );
        })}

        <Button
          size="sm"
          disabled={isPending}
          className="mt-2 self-start"
          onClick={() =>
            mutate(
              { [config.category]: draft },
              { onSuccess: () => toast({ title: `${config.label} settings saved` }) },
            )
          }
        >
          <Save className="mr-2 h-4 w-4" aria-hidden="true" />
          {isPending ? "Saving…" : "Save"}
        </Button>
      </CardContent>
    </Card>
  );
}
