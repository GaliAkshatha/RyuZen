import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useDeleteEvent } from "@/features/events/hooks/useDeleteEvent";
import type { EventResponseDto } from "@/features/events/types/event.types";

export function DeleteEventAction({ event }: { event: EventResponseDto }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate, isPending } = useDeleteEvent();
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
        title="Delete this event?"
        description="This action cannot be undone."
        destructive
        confirmLabel="Delete"
        isConfirming={isPending}
        onConfirm={() =>
          mutate(event.id, {
            onSuccess: () => {
              toast({ title: "Event deleted" });
              navigate("/app/events");
            },
          })
        }
      />
    </>
  );
}
