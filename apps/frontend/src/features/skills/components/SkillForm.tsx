import { Controller } from "react-hook-form";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import { humanizeEnumValue } from "@/utils/humanizeEnumValue";
import type { AppApiError } from "@/types/api";
import { SkillLevel } from "@/types/enums";

import {
  createSkillSchema,
  updateSkillSchema,
  type CreateSkillFormValues,
  type UpdateSkillFormValues,
} from "@/features/skills/schemas/skill.schemas";
import type { SkillResponseDto } from "@/features/skills/types/skill.types";

interface SkillFormProps {
  skill?: SkillResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateSkillFormValues | UpdateSkillFormValues) => void;
  onCancel?: () => void;
}

const SKILL_LEVELS = [
  SkillLevel.BEGINNER,
  SkillLevel.INTERMEDIATE,
  SkillLevel.ADVANCED,
  SkillLevel.EXPERT,
];

export function SkillForm({ skill, isSubmitting, error, onSubmit, onCancel }: SkillFormProps) {
  const isEdit = Boolean(skill);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useAppForm<CreateSkillFormValues>({
    resolver: zodResolver(isEdit ? updateSkillSchema : createSkillSchema),
    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? "",
      level: skill?.level,
    },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="col-span-1 flex flex-col gap-1.5">
          <label htmlFor="name" className="font-body text-sm font-medium text-foreground">
            Name
          </label>
          <Input id="name" aria-invalid={Boolean(errors.name)} {...register("name")} />
        </div>
        <div className="col-span-1 flex flex-col gap-1.5">
          <label htmlFor="category" className="font-body text-sm font-medium text-foreground">
            Category
          </label>
          <Input id="category" {...register("category")} />
        </div>
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="font-body text-sm font-medium text-foreground">Level</label>
          <Controller
            control={control}
            name="level"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-label="Select level">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {SKILL_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {humanizeEnumValue(level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add skill"}
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
