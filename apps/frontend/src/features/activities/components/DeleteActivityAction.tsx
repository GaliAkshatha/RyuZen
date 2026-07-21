import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useDeleteActivity } from "@/features/activities/hooks/useDeleteActivity";
import type { ActivityResponseDto } from "@/features/activities/types/activity.types";

export function DeleteActivityAction({ activity }: { activity: ActivityResponseDto }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutate, isPending } = useDeleteActivity();
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
        title="Delete this activity?"
        description="This action cannot be undone."
        destructive
        confirmLabel="Delete"
        isConfirming={isPending}
        onConfirm={() =>
          mutate(activity.id, {
            onSuccess: () => {
              toast({ title: "Activity deleted" });
              navigate("/app/activities");
            },
          })
        }
      />
    </>
  );
}
