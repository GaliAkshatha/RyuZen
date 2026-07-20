import { useState } from "react";
import { XCircle } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";
import { UserRole, MentorshipStatus } from "@/types/enums";

import { useCancelMentorship } from "@/features/mentorship/hooks/useCancelMentorship";
import type { MentorshipResponseDto } from "@/features/mentorship/types/mentorship.types";

/**
 * Visible ONLY to SUPER_ADMIN/ORG_ADMIN — re-verified against the real
 * backend this milestone: PATCH /mentorships/:id/cancel is the one
 * route in this feature that excludes FACULTY, unlike GET/PATCH/complete
 * which all allow SUPER_ADMIN+ORG_ADMIN+FACULTY. The inverse asymmetry
 * of A3's Verify action (which excludes SUPER_ADMIN instead) — checked
 * against the actual route file directly, not assumed from that pattern.
 */
export function CancelMentorshipAction({ mentorship }: { mentorship: MentorshipResponseDto }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { mutate, isPending } = useCancelMentorship(mentorship.id);
  const [open, setOpen] = useState(false);

  const canCancel = user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ORG_ADMIN;

  if (!canCancel || mentorship.status !== MentorshipStatus.ACTIVE) {
    return null;
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <XCircle className="mr-2 h-4 w-4" aria-hidden="true" />
        Cancel Mentorship
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Cancel this mentorship?"
        description="This will end the mentor-mentee relationship."
        destructive
        confirmLabel="Cancel Mentorship"
        isConfirming={isPending}
        onConfirm={() =>
          mutate(undefined, {
            onSuccess: () => {
              toast({ title: "Mentorship cancelled" });
              setOpen(false);
            },
          })
        }
      />
    </>
  );
}
