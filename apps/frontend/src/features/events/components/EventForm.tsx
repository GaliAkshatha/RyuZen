import { Controller } from "react-hook-form";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Switch } from "@/shared/ui/Switch";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createEventSchema,
  updateEventSchema,
  type CreateEventFormValues,
  type UpdateEventFormValues,
} from "@/features/events/schemas/event.schemas";
import type { EventResponseDto } from "@/features/events/types/event.types";

interface EventFormProps {
  event?: EventResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateEventFormValues | UpdateEventFormValues) => void;
}

function toDateInputValue(iso: string | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function EventForm({ event, isSubmitting, error, onSubmit }: EventFormProps) {
  const isEdit = Boolean(event);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useAppForm<CreateEventFormValues>({
    resolver: zodResolver(isEdit ? updateEventSchema : createEventSchema),
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      venue: event?.venue ?? "",
      startDate: event?.startDate ? new Date(toDateInputValue(event.startDate)) : undefined,
      endDate: event?.endDate ? new Date(toDateInputValue(event.endDate)) : undefined,
      registrationDeadline: event?.registrationDeadline
        ? new Date(toDateInputValue(event.registrationDeadline))
        : undefined,
      capacity: event?.capacity,
      points: event?.points ?? 0,
      certificateEnabled: event?.certificateEnabled ?? false,
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="venue" className="font-body text-sm font-medium text-foreground">
          Venue
        </label>
        <Input id="venue" {...register("venue")} />
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

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="registrationDeadline"
          className="font-body text-sm font-medium text-foreground"
        >
          Registration Deadline (optional)
        </label>
        <Controller
          control={control}
          name="registrationDeadline"
          render={({ field }) => (
            <Input
              id="registrationDeadline"
              type="date"
              value={field.value ? toDateInputValue(new Date(field.value).toISOString()) : ""}
              onChange={(e) =>
                field.onChange(e.target.value ? new Date(e.target.value) : undefined)
              }
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="capacity" className="font-body text-sm font-medium text-foreground">
            Capacity (optional)
          </label>
          <Input id="capacity" type="number" min={1} {...register("capacity")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="points" className="font-body text-sm font-medium text-foreground">
            Points
          </label>
          <Input id="points" type="number" min={0} {...register("points")} />
        </div>
      </div>

      <Controller
        control={control}
        name="certificateEnabled"
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch
              id="certificateEnabled"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label
              htmlFor="certificateEnabled"
              className="font-body text-sm font-medium text-foreground"
            >
              Certificate enabled
            </label>
          </div>
        )}
      />

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create event"}
      </Button>
    </form>
  );
}
