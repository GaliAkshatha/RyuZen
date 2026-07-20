import { Award } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useToast } from "@/hooks/useToast";

import { useIssueCertificates } from "@/features/events/hooks/useIssueCertificates";
import type { EventResponseDto } from "@/features/events/types/event.types";

/**
 * Bulk action — issues certificates to every attended-but-not-yet-issued
 * registration in one call (confirmed against IssueCertificatesUseCase
 * this milestone). Disabled unless certificateEnabled, matching the
 * backend's real rule exactly ("Certificates are not enabled for this
 * event.").
 */
export function IssueCertificatesAction({ event }: { event: EventResponseDto }) {
  const { toast } = useToast();
  const { mutate, isPending } = useIssueCertificates(event.id);

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending || !event.certificateEnabled}
      title={!event.certificateEnabled ? "Certificates are not enabled for this event." : undefined}
      onClick={() =>
        mutate(undefined, {
          onSuccess: (issued) =>
            toast({
              title: "Certificates issued",
              description: `${issued.length} certificate(s) issued.`,
            }),
        })
      }
    >
      <Award className="mr-2 h-4 w-4" aria-hidden="true" />
      {isPending ? "Issuing…" : "Issue Certificates"}
    </Button>
  );
}
