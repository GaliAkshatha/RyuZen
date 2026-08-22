import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import {
  updatePortfolioSettingsSchema,
  type UpdatePortfolioSettingsFormValues,
} from "@/domains/portfolio/portfolioSchemas";
import type { Portfolio, UpdatePortfolioSettingsRequest } from "@/domains/portfolio/portfolio.types";

const SOCIAL_FIELDS: { key: keyof UpdatePortfolioSettingsFormValues; label: string }[] = [
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "leetcode", label: "LeetCode" },
  { key: "codeforces", label: "Codeforces" },
  { key: "portfolio", label: "Portfolio site" },
  { key: "website", label: "Website" },
];

export function PortfolioSettingsForm({
  portfolio,
  onSubmit,
  isSubmitting,
}: {
  portfolio: Portfolio;
  onSubmit: (values: UpdatePortfolioSettingsRequest) => void;
  isSubmitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdatePortfolioSettingsFormValues>({
    resolver: zodResolver(updatePortfolioSettingsSchema),
    defaultValues: {
      headline: portfolio.headline ?? "",
      summary: portfolio.summary ?? "",
      github: portfolio.github ?? "",
      linkedin: portfolio.linkedin ?? "",
      leetcode: portfolio.leetcode ?? "",
      codeforces: portfolio.codeforces ?? "",
      portfolio: portfolio.portfolio ?? "",
      website: portfolio.website ?? "",
      visibility: portfolio.visibility,
    },
  });

  function handleFormSubmit(values: UpdatePortfolioSettingsFormValues) {
    const cleaned: UpdatePortfolioSettingsRequest = {};
    for (const [key, value] of Object.entries(values)) {
      if (value) (cleaned as Record<string, unknown>)[key] = value;
    }
    onSubmit(cleaned);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="portfolio-headline">Headline</Label>
        <Input id="portfolio-headline" placeholder="e.g. Full-stack developer, ML enthusiast" {...register("headline")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="portfolio-summary">Summary</Label>
        <Input id="portfolio-summary" {...register("summary")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {SOCIAL_FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <Label htmlFor={`portfolio-${field.key}`}>{field.label}</Label>
            <Input id={`portfolio-${field.key}`} placeholder="https://" {...register(field.key)} />
            {errors[field.key] && <p className="text-xs text-destructive">{errors[field.key]?.message}</p>}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Visibility</Label>
        <Controller
          control={control}
          name="visibility"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-1 w-fit">
        {isSubmitting ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
