import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

interface NewChatFormProps {
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (participantId: string) => void;
}

const newChatFormSchema = z.object({
  participantId: z.string().trim().min(1, "A user ID is required."),
});

/**
 * Raw user-ID entry — there's no generic cross-role "browse/search all
 * users" endpoint wired into a reusable hook in this app, same
 * established precedent as IssueCertificateForm's eventId/activityId
 * fields (C5). The creator's own userId is added automatically
 * server-side, so this form only collects the OTHER participant.
 * Always creates a DIRECT chat — the backend is idempotent here: if
 * one already exists between the two users, it returns the existing
 * chat instead of erroring.
 */
export function NewChatForm({ isSubmitting, error, onSubmit }: NewChatFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<z.infer<typeof newChatFormSchema>>({
    resolver: zodResolver(newChatFormSchema),
    defaultValues: { participantId: "" },
  });

  const fieldErrors = errors.participantId
    ? [errors.participantId.message ?? "Invalid value."]
    : [];
  const apiErrors = flattenApiErrors(error);

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values.participantId))}
      className="flex flex-col gap-3"
      noValidate
    >
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="participantId" className="font-body text-sm font-medium text-foreground">
          User ID
        </label>
        <Input
          id="participantId"
          placeholder="Enter the other user's ID"
          {...register("participantId")}
        />
      </div>

      <Button type="submit" size="sm" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Starting…" : "Start Chat"}
      </Button>
    </form>
  );
}
