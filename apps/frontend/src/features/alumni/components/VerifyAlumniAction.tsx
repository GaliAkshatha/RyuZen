import { BadgeCheck } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/shared/ui/Button";
import { useToast } from "@/hooks/useToast";
import { UserRole } from "@/types/enums";

import { useVerifyAlumni } from "@/features/alumni/hooks/useVerifyAlumni";
import type { AlumniResponseDto } from "@/features/alumni/types/alumni.types";

/**
 * Visible only to ORG_ADMIN — re-verified against the real backend this
 * milestone: PATCH /alumni/:id/verify is gated to ORG_ADMIN alone,
 * explicitly excluding SUPER_ADMIN (unlike every other alumni route,
 * which allows both). This is the recurring "re-verify role asymmetry
 * at Definition of Done time" check the roadmap calls out — checked
 * against the actual route file again here, not assumed from earlier
 * milestones.
 */
export function VerifyAlumniAction({ alumnus }: { alumnus: AlumniResponseDto }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { mutate, isPending } = useVerifyAlumni(alumnus.id);

  if (user?.role !== UserRole.ORG_ADMIN) {
    return null;
  }

  if (alumnus.isVerified) {
    return (
      <span className="inline-flex items-center gap-1 font-body text-sm text-success">
        <BadgeCheck className="h-4 w-4" aria-hidden="true" />
        Verified
      </span>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() => mutate(undefined, { onSuccess: () => toast({ title: "Alumnus verified" }) })}
    >
      <BadgeCheck className="mr-2 h-4 w-4" aria-hidden="true" />
      {isPending ? "Verifying…" : "Verify"}
    </Button>
  );
}
