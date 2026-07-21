import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  resubmitSubmissionSchema,
  type ResubmitSubmissionFormValues,
} from "@/features/submissions/schemas/submission.schemas";

interface ResubmitFormProps {
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: ResubmitSubmissionFormValues) => void;
}

export function ResubmitForm({ isSubmitting, error, onSubmit }: ResubmitFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResubmitSubmissionFormValues>({
    resolver: zodResolver(resubmitSubmissionSchema),
    defaultValues: {
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
        {isSubmitting ? "Resubmitting…" : "Resubmit"}
      </Button>
    </form>
  );
}
