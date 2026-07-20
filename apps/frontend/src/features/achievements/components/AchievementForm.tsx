import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";
import { AchievementLevel } from "@/types/enums";

import {
  createAchievementSchema,
  updateAchievementSchema,
  type CreateAchievementFormValues,
  type UpdateAchievementFormValues,
} from "@/features/achievements/schemas/achievement.schemas";
import type { AchievementResponseDto } from "@/features/achievements/types/achievement.types";

interface AchievementFormProps {
  achievement?: AchievementResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateAchievementFormValues | UpdateAchievementFormValues) => void;
  onCancel?: () => void;
}

const ACHIEVEMENT_LEVELS = [
  AchievementLevel.COLLEGE,
  AchievementLevel.STATE,
  AchievementLevel.NATIONAL,
  AchievementLevel.INTERNATIONAL,
];

function toDateInputValue(iso: string | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

/**
 * Blank credentialUrl/proofUrl are converted to undefined before
 * validation — same reasoning as CertificationForm.tsx (CE4): the
 * backend's `.url().optional()` only skips validation for undefined,
 * not an empty string.
 */
export function AchievementForm({
  achievement,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: AchievementFormProps) {
  const isEdit = Boolean(achievement);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateAchievementFormValues>({
    resolver: zodResolver(isEdit ? updateAchievementSchema : createAchievementSchema),
    defaultValues: {
      title: achievement?.title ?? "",
      description: achievement?.description ?? "",
      category: achievement?.category ?? "",
      level: achievement?.level,
      position: achievement?.position ?? "",
      certificateUrl: achievement?.certificateUrl ?? "",
      proofUrl: achievement?.proofUrl ?? "",
      achievementDate: achievement?.achievementDate
        ? new Date(toDateInputValue(achievement.achievementDate))
        : undefined,
    },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit({
          ...values,
          certificateUrl: values.certificateUrl?.trim() ? values.certificateUrl.trim() : undefined,
          proofUrl: values.proofUrl?.trim() ? values.proofUrl.trim() : undefined,
        }),
      )}
      className="flex flex-col gap-3"
      noValidate
    >
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="font-body text-sm font-medium text-foreground">
          Title
        </label>
        <Input id="title" aria-invalid={Boolean(errors.title)} {...register("title")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="font-body text-sm font-medium text-foreground">
          Description (optional)
        </label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="font-body text-sm font-medium text-foreground">
            Category (optional)
          </label>
          <Input id="category" {...register("category")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-sm font-medium text-foreground">Level (optional)</label>
          <Controller
            control={control}
            name="level"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-label="Select level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {ACHIEVEMENT_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="position" className="font-body text-sm font-medium text-foreground">
            Position (optional)
          </label>
          <Input id="position" placeholder="e.g. 1st place" {...register("position")} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="achievementDate" className="font-body text-sm font-medium text-foreground">
          Achievement Date
        </label>
        <Controller
          control={control}
          name="achievementDate"
          render={({ field }) => (
            <Input
              id="achievementDate"
              type="date"
              value={field.value ? toDateInputValue(new Date(field.value).toISOString()) : ""}
              onChange={(e) =>
                field.onChange(e.target.value ? new Date(e.target.value) : undefined)
              }
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="certificateUrl" className="font-body text-sm font-medium text-foreground">
            Certificate URL (optional)
          </label>
          <Input id="certificateUrl" placeholder="https://…" {...register("certificateUrl")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="proofUrl" className="font-body text-sm font-medium text-foreground">
            Proof URL (optional)
          </label>
          <Input id="proofUrl" placeholder="https://…" {...register("proofUrl")} />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Submit achievement"}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
