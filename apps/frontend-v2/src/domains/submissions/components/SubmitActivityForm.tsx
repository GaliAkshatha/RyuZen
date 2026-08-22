import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { createSubmissionSchema, type CreateSubmissionFormValues } from "@/domains/submissions/submissionSchemas";
import type { AppApiError } from "@/shared/types/api.types";

export function SubmitActivityForm({
  onSubmit,
  isSubmitting,
  submitError,
}: {
  onSubmit: (values: CreateSubmissionFormValues) => void;
  isSubmitting: boolean;
  submitError?: AppApiError | null;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateSubmissionFormValues>({
    resolver: zodResolver(createSubmissionSchema),
    defaultValues: { attachments: [{ name: "", url: "", mimeType: "application/pdf" }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "attachments" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {submitError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{submitError.message}</p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="submission-remarks">Remarks (optional)</Label>
        <Input id="submission-remarks" placeholder="Anything you'd like to add…" {...register("remarks")} />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Proof of completion</Label>
        <p className="text-xs text-muted-foreground">Link to your certificate, repo, submission, or other proof - at least one is required.</p>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2">
            <div className="flex flex-1 flex-col gap-1.5">
              <Input placeholder="Name (e.g. Certificate)" {...register(`attachments.${index}.name` as const)} />
              {errors.attachments?.[index]?.name && (
                <p className="text-xs text-destructive">{errors.attachments[index]?.name?.message}</p>
              )}
            </div>
            <div className="flex flex-[2] flex-col gap-1.5">
              <Input placeholder="https://" {...register(`attachments.${index}.url` as const)} />
              {errors.attachments?.[index]?.url && (
                <p className="text-xs text-destructive">{errors.attachments[index]?.url?.message}</p>
              )}
            </div>
            {fields.length > 1 && (
              <Button type="button" size="icon" variant="ghost" onClick={() => remove(index)} aria-label="Remove attachment">
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        ))}
        {errors.attachments?.root && <p className="text-xs text-destructive">{errors.attachments.root.message}</p>}
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="flex w-fit items-center gap-1.5"
          onClick={() => append({ name: "", url: "", mimeType: "application/pdf" })}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add another
        </Button>
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-1 w-fit">
        {isSubmitting ? "Submitting…" : "Submit"}
      </Button>
    </form>
  );
}
