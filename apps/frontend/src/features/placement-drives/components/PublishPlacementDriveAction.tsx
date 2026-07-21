import { Send } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useToast } from "@/hooks/useToast";
import { PlacementDriveStatus } from "@/types/enums";

import { usePublishPlacementDrive } from "@/features/placement-drives/hooks/usePublishPlacementDrive";
import type { PlacementDriveResponseDto } from "@/features/placement-drives/types/placementDrive.types";

/** Shown only for DRAFT — matches PlacementDrive.publish()'s real rule exactly ("Only draft placement drives can be published."), confirmed this milestone. */
export function PublishPlacementDriveAction({ drive }: { drive: PlacementDriveResponseDto }) {
  const { toast } = useToast();
  const { mutate, isPending } = usePublishPlacementDrive(drive.id);

  if (drive.status !== PlacementDriveStatus.DRAFT) {
    return null;
  }

  return (
    <Button
      size="sm"
      disabled={isPending}
      onClick={() => mutate(undefined, { onSuccess: () => toast({ title: "Drive published" }) })}
    >
      <Send className="mr-2 h-4 w-4" aria-hidden="true" />
      {isPending ? "Publishing…" : "Publish"}
    </Button>
  );
}
