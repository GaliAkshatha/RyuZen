import { Controller } from "react-hook-form";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { Checkbox } from "@/shared/ui/Checkbox";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import { useDepartments } from "@/features/departments/hooks/useDepartments";

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
  const { data: departments } = useDepartments();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useAppForm<CreatePlacementDriveFormValues>({
    resolver: zodResolver(isEdit ? updatePlacementDriveSchema : createPlacementDriveSchema),
    defaultValues: {
      companyId: drive?.companyId ?? "",
      title: drive?.title ?? "",
      description: drive?.description ?? "",
      package: drive?.package ?? "",
      location: drive?.location ?? "",
      eligibility: drive?.eligibility ?? "",
      eligibilityCriteria: {
        departmentIds: drive?.eligibilityCriteria?.departmentIds ?? [],
        minCgpa: drive?.eligibilityCriteria?.minCgpa,
        minSemester: drive?.eligibilityCriteria?.minSemester,
        batches: drive?.eligibilityCriteria?.batches ?? [],
      },
      deadline: drive?.deadline ? new Date(toDateInputValue(drive.deadline)) : undefined,
    },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  function handleFormSubmit(
    values: CreatePlacementDriveFormValues | UpdatePlacementDriveFormValues,
  ) {
    const criteria = values.eligibilityCriteria;
    const normalizedCriteria =
      criteria &&
      (criteria.departmentIds?.length ||
        criteria.minCgpa !== undefined ||
        criteria.minSemester !== undefined ||
        criteria.batches?.length)
        ? {
            departmentIds: criteria.departmentIds?.length ? criteria.departmentIds : undefined,
            minCgpa: criteria.minCgpa,
            minSemester: criteria.minSemester,
            batches: criteria.batches?.length ? criteria.batches : undefined,
          }
        : undefined;

    onSubmit({ ...values, eligibilityCriteria: normalizedCriteria });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
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
        <p className="font-body text-xs text-muted-foreground">
          Human-readable description shown to students. The real gate students are checked
          against is set below.
        </p>
      </div>

      <fieldset className="flex flex-col gap-3 rounded-md border border-border p-4">
        <legend className="px-1 font-body text-sm font-medium text-foreground">
          Eligibility Criteria (optional)
        </legend>
        <p className="-mt-1 font-body text-xs text-muted-foreground">
          The real gate — students who don't meet every condition set here cannot apply, and
          won't appear in your eligible-students list. Leave everything blank to allow every
          student.
        </p>

        {departments && departments.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-sm text-foreground">Departments</span>
            <Controller
              control={control}
              name="eligibilityCriteria.departmentIds"
              render={({ field }) => (
                <div className="flex flex-wrap gap-3">
                  {departments.map((department) => {
                    const checked = (field.value ?? []).includes(department.id);
                    return (
                      <label
                        key={department.id}
                        className="flex items-center gap-2 font-body text-sm text-foreground"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) => {
                            const current = field.value ?? [];
                            field.onChange(
                              value
                                ? [...current, department.id]
                                : current.filter((id) => id !== department.id),
                            );
                          }}
                        />
                        {department.name}
                      </label>
                    );
                  })}
                </div>
              )}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="minCgpa" className="font-body text-sm text-foreground">
              Minimum CGPA
            </label>
            <Input
              id="minCgpa"
              type="number"
              step="0.1"
              min={0}
              max={10}
              {...register("eligibilityCriteria.minCgpa")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="minSemester" className="font-body text-sm text-foreground">
              Minimum Semester
            </label>
            <Input
              id="minSemester"
              type="number"
              min={1}
              max={12}
              {...register("eligibilityCriteria.minSemester")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="batches" className="font-body text-sm text-foreground">
              Batches
            </label>
            <Controller
              control={control}
              name="eligibilityCriteria.batches"
              render={({ field }) => (
                <Input
                  id="batches"
                  placeholder="2024, 2025"
                  value={(field.value ?? []).join(", ")}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value
                        .split(",")
                        .map((b) => b.trim())
                        .filter(Boolean),
                    )
                  }
                />
              )}
            />
          </div>
        </div>
      </fieldset>

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
