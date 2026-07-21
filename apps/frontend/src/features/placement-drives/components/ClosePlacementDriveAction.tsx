import { Lock } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useToast } from "@/hooks/useToast";
import { PlacementDriveStatus } from "@/types/enums";

import { useClosePlacementDrive } from "@/features/placement-drives/hooks/useClosePlacementDrive";
import type { PlacementDriveResponseDto } from "@/features/placement-drives/types/placementDrive.types";

/**
 * Shown only for PUBLISHED. The backend's close() method has no
 * state-transition restriction at all (confirmed this milestone — it
 * can be called from any status, same as Activities/Events). This is a
 * UX choice, not a claimed backend rule.
 */
export function ClosePlacementDriveAction({ drive }: { drive: PlacementDriveResponseDto }) {
  const { toast } = useToast();
  const { mutate, isPending } = useClosePlacementDrive(drive.id);

  if (drive.status !== PlacementDriveStatus.PUBLISHED) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() => mutate(undefined, { onSuccess: () => toast({ title: "Drive closed" }) })}
    >
      <Lock className="mr-2 h-4 w-4" aria-hidden="true" />
      {isPending ? "Closing…" : "Close"}
    </Button>
  );
}
