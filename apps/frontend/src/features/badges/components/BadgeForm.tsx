import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createBadgeSchema,
  updateBadgeSchema,
  type CreateBadgeFormValues,
  type UpdateBadgeFormValues,
} from "@/features/badges/schemas/badge.schemas";
import type { BadgeResponseDto } from "@/features/badges/types/badge.types";

interface BadgeFormProps {
  badge?: BadgeResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateBadgeFormValues | UpdateBadgeFormValues) => void;
}

export function BadgeForm({ badge, isSubmitting, error, onSubmit }: BadgeFormProps) {
  const isEdit = Boolean(badge);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBadgeFormValues>({
    resolver: zodResolver(isEdit ? updateBadgeSchema : createBadgeSchema),
    defaultValues: {
      name: badge?.name ?? "",
      description: badge?.description ?? "",
      icon: badge?.icon ?? "",
      criteria: badge?.criteria ?? "",
      points: badge?.points ?? 0,
    },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="font-body text-sm font-medium text-foreground">
          Name
        </label>
        <Input id="name" aria-invalid={Boolean(errors.name)} {...register("name")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="font-body text-sm font-medium text-foreground">
          Description
        </label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="icon" className="font-body text-sm font-medium text-foreground">
          Icon URL
        </label>
        <Input id="icon" placeholder="https://…" {...register("icon")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="criteria" className="font-body text-sm font-medium text-foreground">
          Criteria
        </label>
        <Textarea
          id="criteria"
          rows={2}
          placeholder="What does a student need to do to earn this badge?"
          {...register("criteria")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="points" className="font-body text-sm font-medium text-foreground">
          Points
        </label>
        <Input id="points" type="number" min={0} {...register("points")} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create badge"}
      </Button>
    </form>
  );
}
