import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";
import { PortfolioVisibility } from "@/types/enums";

import {
  updateUserPortfolioSchema,
  type UpdateUserPortfolioFormValues,
} from "@/features/portfolio/schemas/userPortfolio.schemas";
import type { UserPortfolioSettingsResponseDto } from "@/features/portfolio/types/portfolio.types";

interface PortfolioSettingsFormProps {
  settings?: Partial<UserPortfolioSettingsResponseDto>;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: UpdateUserPortfolioFormValues) => void;
}

const URL_FIELDS = [
  "github",
  "linkedin",
  "leetcode",
  "codeforces",
  "portfolio",
  "behance",
  "dribbble",
  "website",
] as const;

export function PortfolioSettingsForm({
  settings,
  isSubmitting,
  error,
  onSubmit,
}: PortfolioSettingsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateUserPortfolioFormValues>({
    resolver: zodResolver(updateUserPortfolioSchema),
    defaultValues: {
      headline: settings?.headline ?? "",
      summary: settings?.summary ?? "",
      github: settings?.github ?? "",
      linkedin: settings?.linkedin ?? "",
      leetcode: settings?.leetcode ?? "",
      codeforces: settings?.codeforces ?? "",
      portfolio: settings?.portfolio ?? "",
      behance: settings?.behance ?? "",
      dribbble: settings?.dribbble ?? "",
      website: settings?.website ?? "",
      visibility: settings?.visibility,
      theme: settings?.theme ?? "",
    },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form
      onSubmit={handleSubmit((values) => {
        const cleaned = { ...values };
        for (const field of URL_FIELDS) {
          cleaned[field] = cleaned[field]?.trim() ? cleaned[field]?.trim() : undefined;
        }
        onSubmit(cleaned);
      })}
      className="flex flex-col gap-3"
      noValidate
    >
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="headline" className="font-body text-sm font-medium text-foreground">
          Headline (optional)
        </label>
        <Input
          id="headline"
          placeholder="Full-Stack Developer & Open Source Contributor"
          {...register("headline")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="summary" className="font-body text-sm font-medium text-foreground">
          Summary (optional)
        </label>
        <Textarea id="summary" rows={3} {...register("summary")} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="github" className="font-body text-sm font-medium text-foreground">
            GitHub (optional)
          </label>
          <Input id="github" placeholder="https://…" {...register("github")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="linkedin" className="font-body text-sm font-medium text-foreground">
            LinkedIn (optional)
          </label>
          <Input id="linkedin" placeholder="https://…" {...register("linkedin")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="leetcode" className="font-body text-sm font-medium text-foreground">
            LeetCode (optional)
          </label>
          <Input id="leetcode" placeholder="https://…" {...register("leetcode")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="codeforces" className="font-body text-sm font-medium text-foreground">
            Codeforces (optional)
          </label>
          <Input id="codeforces" placeholder="https://…" {...register("codeforces")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="behance" className="font-body text-sm font-medium text-foreground">
            Behance (optional)
          </label>
          <Input id="behance" placeholder="https://…" {...register("behance")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="dribbble" className="font-body text-sm font-medium text-foreground">
            Dribbble (optional)
          </label>
          <Input id="dribbble" placeholder="https://…" {...register("dribbble")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="website" className="font-body text-sm font-medium text-foreground">
            Website (optional)
          </label>
          <Input id="website" placeholder="https://…" {...register("website")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="portfolio" className="font-body text-sm font-medium text-foreground">
            External Portfolio (optional)
          </label>
          <Input id="portfolio" placeholder="https://…" {...register("portfolio")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-sm font-medium text-foreground">Visibility</label>
          <Controller
            control={control}
            name="visibility"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-label="Select visibility">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PortfolioVisibility.PUBLIC}>Public</SelectItem>
                  <SelectItem value={PortfolioVisibility.PRIVATE}>Private</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="theme" className="font-body text-sm font-medium text-foreground">
            Theme (optional)
          </label>
          <Input id="theme" placeholder="e.g. minimal, dark" {...register("theme")} />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Saving…" : "Save Settings"}
      </Button>
    </form>
  );
}
