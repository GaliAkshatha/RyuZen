import { Send } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useToast } from "@/hooks/useToast";
import { ActivityStatus } from "@/types/enums";

import { usePublishActivity } from "@/features/activities/hooks/usePublishActivity";
import type { ActivityResponseDto } from "@/features/activities/types/activity.types";

/**
 * Shown only for DRAFT — matches the backend's real rule exactly
 * (Activity.publish() throws "Only draft activities can be published."
 * for any other status, confirmed this milestone).
 */
export function PublishActivityAction({ activity }: { activity: ActivityResponseDto }) {
  const { toast } = useToast();
  const { mutate, isPending } = usePublishActivity(activity.id);

  if (activity.status !== ActivityStatus.DRAFT) {
    return null;
  }

  return (
    <Button
      size="sm"
      disabled={isPending}
      onClick={() => mutate(undefined, { onSuccess: () => toast({ title: "Activity published" }) })}
    >
      <Send className="mr-2 h-4 w-4" aria-hidden="true" />
      {isPending ? "Publishing…" : "Publish"}
    </Button>
  );
}
