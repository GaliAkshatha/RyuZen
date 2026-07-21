import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useDeleteBadge } from "@/features/badges/hooks/useDeleteBadge";
import type { BadgeResponseDto } from "@/features/badges/types/badge.types";

export function DeleteBadgeAction({ badge }: { badge: BadgeResponseDto }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate, isPending } = useDeleteBadge();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
        Delete
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this badge?"
        description="This removes it from the global catalog. This action cannot be undone."
        destructive
        confirmLabel="Delete"
        isConfirming={isPending}
        onConfirm={() =>
          mutate(badge.id, {
            onSuccess: () => {
              toast({ title: "Badge deleted" });
              navigate("/app/badges");
            },
          })
        }
      />
    </>
  );
}
