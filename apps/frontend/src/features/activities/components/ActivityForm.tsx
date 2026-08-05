import { Controller } from "react-hook-form";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { humanizeEnumValue } from "@/utils/humanizeEnumValue";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createActivitySchema,
  updateActivitySchema,
  type CreateActivityFormValues,
  type UpdateActivityFormValues,
} from "@/features/activities/schemas/activity.schemas";
import type { ActivityResponseDto } from "@/features/activities/types/activity.types";

const ACTIVITY_TYPES = [
  "ASSIGNMENT",
  "WORKSHOP",
  "EVENT",
  "HACKATHON",
  "QUIZ",
  "FORM",
  "SURVEY",
] as const;
const ACTIVITY_VISIBILITIES = ["PUBLIC", "DEPARTMENT", "SEMESTER", "YEAR", "PRIVATE"] as const;

interface ActivityFormProps {
  activity?: ActivityResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateActivityFormValues | UpdateActivityFormValues) => void;
}

function toDateInputValue(iso: string | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

/**
 * Attachments UI is deliberately minimal — one optional name/URL pair,
 * translated to a 0- or 1-item array on submit. `attachments` is a
 * required array on CreateActivityDto (an empty array satisfies it),
 * not an optional field; a full multi-attachment upload UI is out of
 * scope without a file-upload backend, which doesn't exist here.
 */
export function ActivityForm({ activity, isSubmitting, error, onSubmit }: ActivityFormProps) {
  const isEdit = Boolean(activity);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useAppForm<CreateActivityFormValues>({
    resolver: zodResolver(isEdit ? updateActivitySchema : createActivitySchema),
    defaultValues: {
      title: activity?.title ?? "",
      description: activity?.description ?? "",
      type: activity?.type,
      visibility: activity?.visibility,
      points: activity?.points ?? 0,
      penaltyPoints: activity?.penaltyPoints ?? 0,
      startDate: activity?.startDate ? new Date(toDateInputValue(activity.startDate)) : undefined,
      endDate: activity?.endDate ? new Date(toDateInputValue(activity.endDate)) : undefined,
      attachments: activity?.attachments ?? [],
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
        <label htmlFor="title" className="font-body text-sm font-medium text-foreground">
          Title
        </label>
        <Input id="title" aria-invalid={Boolean(errors.title)} {...register("title")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="font-body text-sm font-medium text-foreground">
          Description
        </label>
        <Textarea
          id="description"
          rows={4}
          aria-invalid={Boolean(errors.description)}
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="type" className="font-body text-sm font-medium text-foreground">
            Type
          </label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="type" aria-label="Select type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {humanizeEnumValue(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="visibility" className="font-body text-sm font-medium text-foreground">
            Visibility
          </label>
          <Controller
            control={control}
            name="visibility"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="visibility" aria-label="Select visibility">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_VISIBILITIES.map((visibility) => (
                    <SelectItem key={visibility} value={visibility}>
                      {humanizeEnumValue(visibility)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="points" className="font-body text-sm font-medium text-foreground">
            Points
          </label>
          <Input id="points" type="number" min={0} {...register("points")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="penaltyPoints" className="font-body text-sm font-medium text-foreground">
            Penalty Points
          </label>
          <Input id="penaltyPoints" type="number" min={0} {...register("penaltyPoints")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="startDate" className="font-body text-sm font-medium text-foreground">
            Start Date
          </label>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <Input
                id="startDate"
                type="date"
                value={field.value ? toDateInputValue(new Date(field.value).toISOString()) : ""}
                onChange={(e) =>
                  field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                }
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="endDate" className="font-body text-sm font-medium text-foreground">
            End Date
          </label>
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <Input
                id="endDate"
                type="date"
                value={field.value ? toDateInputValue(new Date(field.value).toISOString()) : ""}
                onChange={(e) =>
                  field.onChange(e.target.value ? new Date(e.target.value) : undefined)
                }
              />
            )}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create activity"}
      </Button>
    </form>
  );
}
