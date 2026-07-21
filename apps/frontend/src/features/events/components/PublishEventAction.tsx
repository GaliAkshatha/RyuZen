import { Send } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useToast } from "@/hooks/useToast";
import { EventStatus } from "@/types/enums";

import { usePublishEvent } from "@/features/events/hooks/usePublishEvent";
import type { EventResponseDto } from "@/features/events/types/event.types";

/** Shown only for DRAFT — matches Event.publish()'s real rule exactly ("Only draft events can be published."), confirmed this milestone. */
export function PublishEventAction({ event }: { event: EventResponseDto }) {
  const { toast } = useToast();
  const { mutate, isPending } = usePublishEvent(event.id);

  if (event.status !== EventStatus.DRAFT) {
    return null;
  }

  return (
    <Button
      size="sm"
      disabled={isPending}
      onClick={() => mutate(undefined, { onSuccess: () => toast({ title: "Event published" }) })}
    >
      <Send className="mr-2 h-4 w-4" aria-hidden="true" />
      {isPending ? "Publishing…" : "Publish"}
    </Button>
  );
}
