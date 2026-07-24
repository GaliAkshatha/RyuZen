import { useState } from "react";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  inviteAlumniSchema,
  type InviteAlumniFormValues,
} from "@/features/alumni/schemas/alumni.schemas";
import type { InviteAlumniResponseDto } from "@/features/alumni/types/alumni.types";

interface InviteAlumniFormProps {
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (
    values: InviteAlumniFormValues,
    onDone: (result: InviteAlumniResponseDto) => void,
  ) => void;
}

/**
 * Same dev-token handling pattern as P1's ForgotPasswordPage — the
 * backend's InviteAlumniUseCase returns the invite token directly in
 * the response (no email delivery infrastructure exists yet, confirmed
 * this milestone). Shown clearly labeled as a development convenience,
 * never presented as if it were emailed.
 */
export function InviteAlumniForm({ isSubmitting, error, onSubmit }: InviteAlumniFormProps) {
  const [result, setResult] = useState<InviteAlumniResponseDto | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<InviteAlumniFormValues>({
    resolver: zodResolver(inviteAlumniSchema),
    defaultValues: { email: "", name: "", graduationYear: undefined },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  if (result) {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-body text-sm text-foreground">
          Invitation created for <strong>{result.email}</strong>.
        </p>
        <div className="flex flex-col gap-3 rounded-md border border-warning/40 bg-warning/5 p-3">
          <p className="flex items-center gap-2 font-body text-xs font-medium text-warning">
            <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
            Development mode
          </p>
          <p className="font-body text-xs text-muted-foreground">
            No email delivery is configured on the backend yet, so the invite token is shown here
            directly instead of being emailed. This will not happen in production.
          </p>
          <code className="break-all rounded bg-muted px-2 py-1 font-mono text-xs text-foreground">
            {result.inviteToken}
          </code>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values, setResult))}
      className="flex flex-col gap-4"
      noValidate
    >
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="font-body text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="email"
          type="email"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="font-body text-sm font-medium text-foreground">
          Name (optional)
        </label>
        <Input id="name" {...register("name")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="graduationYear" className="font-body text-sm font-medium text-foreground">
          Graduation Year (optional)
        </label>
        <Input
          id="graduationYear"
          type="number"
          min={1950}
          max={2100}
          {...register("graduationYear")}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-2 self-start">
        {isSubmitting ? "Sending invite…" : "Send Invitation"}
      </Button>
    </form>
  );
}
