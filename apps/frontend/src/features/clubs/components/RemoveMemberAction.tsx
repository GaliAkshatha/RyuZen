import { useState } from "react";
import { UserMinus } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useRemoveClubMember } from "@/features/clubs/hooks/useRemoveClubMember";

export function RemoveMemberAction({ clubId, memberId }: { clubId: string; memberId: string }) {
  const { toast } = useToast();
  const { mutate, isPending } = useRemoveClubMember(clubId);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Remove member">
        <UserMinus className="h-4 w-4 text-destructive" aria-hidden="true" />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Remove this member?"
        destructive
        confirmLabel="Remove"
        isConfirming={isPending}
        onConfirm={() =>
          mutate(memberId, {
            onSuccess: () => {
              toast({ title: "Member removed" });
              setOpen(false);
            },
          })
        }
      />
    </>
  );
}
