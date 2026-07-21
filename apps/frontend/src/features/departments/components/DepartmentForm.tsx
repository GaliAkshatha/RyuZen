import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createDepartmentSchema,
  updateDepartmentSchema,
  type CreateDepartmentFormValues,
  type UpdateDepartmentFormValues,
} from "@/features/departments/schemas/department.schemas";
import type { DepartmentResponseDto } from "@/features/departments/types/department.types";

interface DepartmentFormProps {
  department?: DepartmentResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateDepartmentFormValues | UpdateDepartmentFormValues) => void;
}

/**
 * One component handles both create and edit. `code` is only shown
 * (and only required) on create — the backend's UpdateDepartmentSchema
 * has no `code` field at all, confirmed by grep this milestone, so
 * editing an existing department cannot change its code.
 */
export function DepartmentForm({ department, isSubmitting, error, onSubmit }: DepartmentFormProps) {
  const isEdit = Boolean(department);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDepartmentFormValues>({
    resolver: zodResolver(isEdit ? updateDepartmentSchema : createDepartmentSchema),
    defaultValues: {
      name: department?.name ?? "",
      code: department?.code ?? "",
      description: department?.description ?? "",
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

      {!isEdit && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="code" className="font-body text-sm font-medium text-foreground">
            Code
          </label>
          <Input id="code" aria-invalid={Boolean(errors.code)} {...register("code")} />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="font-body text-sm font-medium text-foreground">
          Description
        </label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create department"}
      </Button>
    </form>
  );
}
