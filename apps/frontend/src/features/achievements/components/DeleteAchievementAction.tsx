import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useDeleteAchievement } from "@/features/achievements/hooks/useDeleteAchievement";

export function DeleteAchievementAction({ achievementId }: { achievementId: string }) {
  const { toast } = useToast();
  const { mutate, isPending } = useDeleteAchievement();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Delete achievement"
      >
        <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Remove this achievement?"
        destructive
        confirmLabel="Remove"
        isConfirming={isPending}
        onConfirm={() =>
          mutate(achievementId, {
            onSuccess: () => {
              toast({ title: "Achievement removed" });
              setOpen(false);
            },
          })
        }
      />
    </>
  );
}
