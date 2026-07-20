import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  issueCertificateSchema,
  type IssueCertificateFormValues,
} from "@/features/certificates/schemas/certificate.schemas";

interface IssueCertificateFormProps {
  studentId: string;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: IssueCertificateFormValues) => void;
}

/**
 * studentId is pre-filled from context (this form is always embedded
 * on a specific student's detail page) — not user-editable here.
 * eventId/activityId are optional free-text id fields since there's no
 * natural picker context without knowing which list the admin means;
 * this mirrors how other milestones handle raw-id entry for
 * capabilities without dedicated UI infrastructure.
 */
export function IssueCertificateForm({
  studentId,
  isSubmitting,
  error,
  onSubmit,
}: IssueCertificateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueCertificateFormValues>({
    resolver: zodResolver(issueCertificateSchema),
    defaultValues: { studentId, eventId: "", activityId: "", certificateUrl: "" },
  });

  const fieldErrors = errors.certificateUrl
    ? [`Certificate URL: ${errors.certificateUrl.message}`]
    : [];
  const apiErrors = flattenApiErrors(error);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="certificateUrl" className="font-body text-sm font-medium text-foreground">
          Certificate URL
        </label>
        <Input
          id="certificateUrl"
          placeholder="https://…"
          aria-invalid={Boolean(errors.certificateUrl)}
          {...register("certificateUrl")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="eventId" className="font-body text-sm font-medium text-foreground">
            Event ID (optional)
          </label>
          <Input id="eventId" {...register("eventId")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="activityId" className="font-body text-sm font-medium text-foreground">
            Activity ID (optional)
          </label>
          <Input id="activityId" {...register("activityId")} />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Issuing…" : "Issue Certificate"}
      </Button>
    </form>
  );
}
