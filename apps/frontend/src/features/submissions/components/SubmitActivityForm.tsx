import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createSubmissionSchema,
  type CreateSubmissionFormValues,
} from "@/features/submissions/schemas/submission.schemas";

interface SubmitActivityFormProps {
  activityId: string;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreateSubmissionFormValues) => void;
}

/**
 * Unlike Activities' attachments (optional, empty array allowed),
 * CreateSubmissionSchema requires at least one attachment — confirmed
 * this milestone. One required name/URL/MIME-type field, not an
 * optional add-on.
 */
export function SubmitActivityForm({
  activityId,
  isSubmitting,
  error,
  onSubmit,
}: SubmitActivityFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<CreateSubmissionFormValues>({
    resolver: zodResolver(createSubmissionSchema),
    defaultValues: {
      activityId,
      remarks: "",
      attachments: [{ name: "", url: "", mimeType: "application/octet-stream" }],
    },
  });

  const fieldErrors = [
    ...(errors.remarks ? [`Remarks: ${errors.remarks.message}`] : []),
    ...(errors.attachments?.[0]?.name
      ? [`Attachment name: ${errors.attachments[0].name.message}`]
      : []),
    ...(errors.attachments?.[0]?.url
      ? [`Attachment URL: ${errors.attachments[0].url.message}`]
      : []),
  ];
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="remarks" className="font-body text-sm font-medium text-foreground">
          Remarks (optional)
        </label>
        <Textarea id="remarks" rows={3} {...register("remarks")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="attachmentName" className="font-body text-sm font-medium text-foreground">
          Attachment Name
        </label>
        <Input id="attachmentName" {...register("attachments.0.name")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="attachmentUrl" className="font-body text-sm font-medium text-foreground">
          Attachment URL
        </label>
        <Input id="attachmentUrl" placeholder="https://…" {...register("attachments.0.url")} />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Submitting…" : "Submit"}
      </Button>
    </form>
  );
}
