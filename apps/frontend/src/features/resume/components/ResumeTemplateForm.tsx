import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Switch } from "@/shared/ui/Switch";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createResumeTemplateSchema,
  updateResumeTemplateSchema,
  type CreateResumeTemplateFormValues,
  type UpdateResumeTemplateFormValues,
} from "@/features/resume/schemas/resume.schemas";
import type { ResumeTemplateResponseDto } from "@/features/resume/types/resume.types";

interface ResumeTemplateFormProps {
  template?: ResumeTemplateResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateResumeTemplateFormValues | UpdateResumeTemplateFormValues) => void;
  onCancel?: () => void;
}

export function ResumeTemplateForm({
  template,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: ResumeTemplateFormProps) {
  const isEdit = Boolean(template);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateResumeTemplateFormValues>({
    resolver: zodResolver(isEdit ? updateResumeTemplateSchema : createResumeTemplateSchema),
    defaultValues: {
      name: template?.name ?? "",
      thumbnail: template?.thumbnail ?? "",
      templateFile: template?.templateFile ?? "",
      premium: template?.premium ?? false,
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
          thumbnail: values.thumbnail?.trim() ? values.thumbnail.trim() : undefined,
          templateFile: values.templateFile?.trim() ? values.templateFile.trim() : undefined,
        }),
      )}
      className="flex flex-col gap-3"
      noValidate
    >
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="font-body text-sm font-medium text-foreground">
          Name
        </label>
        <Input id="name" aria-invalid={Boolean(errors.name)} {...register("name")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="thumbnail" className="font-body text-sm font-medium text-foreground">
            Thumbnail URL (optional)
          </label>
          <Input id="thumbnail" placeholder="https://…" {...register("thumbnail")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="templateFile" className="font-body text-sm font-medium text-foreground">
            Template File URL (optional)
          </label>
          <Input id="templateFile" placeholder="https://…" {...register("templateFile")} />
        </div>
      </div>

      <Controller
        control={control}
        name="premium"
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch id="premium" checked={field.value} onCheckedChange={field.onChange} />
            <label htmlFor="premium" className="font-body text-sm font-medium text-foreground">
              Premium template
            </label>
          </div>
        )}
      />

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create template"}
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
