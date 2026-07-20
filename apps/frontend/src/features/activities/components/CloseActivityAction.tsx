import { Lock } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useToast } from "@/hooks/useToast";
import { ActivityStatus } from "@/types/enums";

import { useCloseActivity } from "@/features/activities/hooks/useCloseActivity";
import type { ActivityResponseDto } from "@/features/activities/types/activity.types";

/**
 * Shown only for PUBLISHED. Unlike Publish, the backend's close()
 * method has no state-transition restriction at all (confirmed this
 * milestone — it can be called from any status). This is a UX choice,
 * not a claimed backend rule: closing a draft or already-closed
 * activity doesn't make product sense even though the API permits it.
 */
export function CloseActivityAction({ activity }: { activity: ActivityResponseDto }) {
  const { toast } = useToast();
  const { mutate, isPending } = useCloseActivity(activity.id);

  if (activity.status !== ActivityStatus.PUBLISHED) {
    return null;
  }

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={isPending}
      onClick={() => mutate(undefined, { onSuccess: () => toast({ title: "Activity closed" }) })}
    >
      <Lock className="mr-2 h-4 w-4" aria-hidden="true" />
      {isPending ? "Closing…" : "Close"}
    </Button>
  );
}
