import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  generateResumeSchema,
  type GenerateResumeFormValues,
} from "@/features/resume/schemas/resume.schemas";
import type { ResumeTemplateResponseDto } from "@/features/resume/types/resume.types";

interface GenerateResumeFormProps {
  templates: ResumeTemplateResponseDto[];
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: GenerateResumeFormValues) => void;
}

/**
 * `resumeUrl` requires the client to already have a hosted file URL —
 * confirmed this milestone this endpoint doesn't generate a PDF
 * server-side, it just records a reference (see resume.types.ts).
 */
export function GenerateResumeForm({
  templates,
  isSubmitting,
  error,
  onSubmit,
}: GenerateResumeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<GenerateResumeFormValues>({
    resolver: zodResolver(generateResumeSchema),
    defaultValues: { selectedTemplate: "", resumeUrl: "" },
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
        <label className="font-body text-sm font-medium text-foreground">Template</label>
        <Controller
          control={control}
          name="selectedTemplate"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-label="Select template">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                    {template.premium ? " (Premium)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="resumeUrl" className="font-body text-sm font-medium text-foreground">
          Resume File URL
        </label>
        <Input
          id="resumeUrl"
          placeholder="https://…"
          aria-invalid={Boolean(errors.resumeUrl)}
          {...register("resumeUrl")}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Saving…" : "Save Resume"}
      </Button>
    </form>
  );
}
