import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useDeletePlacementDrive } from "@/features/placement-drives/hooks/useDeletePlacementDrive";
import type { PlacementDriveResponseDto } from "@/features/placement-drives/types/placementDrive.types";

export function DeletePlacementDriveAction({ drive }: { drive: PlacementDriveResponseDto }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate, isPending } = useDeletePlacementDrive();
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
        title="Delete this placement drive?"
        description="This action cannot be undone."
        destructive
        confirmLabel="Delete"
        isConfirming={isPending}
        onConfirm={() =>
          mutate(drive.id, {
            onSuccess: () => {
              toast({ title: "Drive deleted" });
              navigate("/app/placements/drives");
            },
          })
        }
      />
    </>
  );
}
