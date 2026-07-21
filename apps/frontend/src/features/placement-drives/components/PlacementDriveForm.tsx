import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createPlacementDriveSchema,
  updatePlacementDriveSchema,
  type CreatePlacementDriveFormValues,
  type UpdatePlacementDriveFormValues,
} from "@/features/placement-drives/schemas/placementDrive.schemas";
import type { PlacementDriveResponseDto } from "@/features/placement-drives/types/placementDrive.types";
import type { CompanyResponseDto } from "@/features/companies/types/company.types";

interface PlacementDriveFormProps {
  drive?: PlacementDriveResponseDto;
  companies: CompanyResponseDto[];
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreatePlacementDriveFormValues | UpdatePlacementDriveFormValues) => void;
}

function toDateInputValue(iso: string | undefined): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

/** `companyId` is required on create but absent from UpdatePlacementDriveSchema — a drive's company cannot be changed after creation, confirmed this milestone. */
export function PlacementDriveForm({
  drive,
  companies,
  isSubmitting,
  error,
  onSubmit,
}: PlacementDriveFormProps) {
  const isEdit = Boolean(drive);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePlacementDriveFormValues>({
    resolver: zodResolver(isEdit ? updatePlacementDriveSchema : createPlacementDriveSchema),
    defaultValues: {
      companyId: drive?.companyId ?? "",
      title: drive?.title ?? "",
      description: drive?.description ?? "",
      package: drive?.package ?? "",
      location: drive?.location ?? "",
      eligibility: drive?.eligibility ?? "",
      deadline: drive?.deadline ? new Date(toDateInputValue(drive.deadline)) : undefined,
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

      {!isEdit && (
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-sm font-medium text-foreground">Company</label>
          <Controller
            control={control}
            name="companyId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-label="Select company">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="package" className="font-body text-sm font-medium text-foreground">
            Package (optional)
          </label>
          <Input id="package" placeholder="e.g. 12 LPA" {...register("package")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className="font-body text-sm font-medium text-foreground">
            Location (optional)
          </label>
          <Input id="location" {...register("location")} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="eligibility" className="font-body text-sm font-medium text-foreground">
          Eligibility (optional)
        </label>
        <Textarea id="eligibility" rows={2} {...register("eligibility")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="deadline" className="font-body text-sm font-medium text-foreground">
          Application Deadline (optional)
        </label>
        <Controller
          control={control}
          name="deadline"
          render={({ field }) => (
            <Input
              id="deadline"
              type="date"
              value={field.value ? toDateInputValue(new Date(field.value).toISOString()) : ""}
              onChange={(e) =>
                field.onChange(e.target.value ? new Date(e.target.value) : undefined)
              }
            />
          )}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create drive"}
      </Button>
    </form>
  );
}
