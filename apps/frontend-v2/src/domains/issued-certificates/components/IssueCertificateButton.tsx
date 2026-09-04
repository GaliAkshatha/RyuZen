import { useState } from "react";
import { useForm } from "react-hook-form";
import { GraduationCap, X } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useIssueCertificate } from "@/domains/issued-certificates/hooks/useIssueCertificate";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Real gap filled: IssueCertificateSchema/IssueCertificateUseCase
 * existed on the backend (Faculty/Org Admin/Super Admin issuing a
 * real certificate, tied to an activity/event, for a student) with
 * zero frontend caller. A small inline form rather than a full page -
 * issuing is an occasional recognition action, not a primary
 * workflow. certificateUrl is a real link the issuer already has
 * (e.g. a hosted PDF), matching the real backend's own requirement -
 * not a file upload this action performs.
 */
export function IssueCertificateButton({ studentId }: { studentId: string }) {
  const [open, setOpen] = useState(false);
  const { mutate: issue, isPending, error } = useIssueCertificate();
  const { register, handleSubmit, reset } = useForm<{ certificateUrl: string }>();

  function onSubmit(values: { certificateUrl: string }) {
    issue(
      { studentId, certificateUrl: values.certificateUrl },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      },
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80">
        <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
        Issue certificate
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2" noValidate>
      <Input
        placeholder="https://... certificate URL"
        disabled={isPending}
        className="h-8 w-56 text-xs"
        {...register("certificateUrl", { required: true })}
      />
      <Button type="submit" size="sm" disabled={isPending} className="h-8">
        {isPending ? "Issuing…" : "Issue"}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)} className="h-8 w-8 p-0">
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
      {error && <p className="text-xs text-destructive">{(error as AppApiError).message}</p>}
    </form>
  );
}
