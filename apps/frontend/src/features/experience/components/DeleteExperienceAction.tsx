import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useDeleteExperience } from "@/features/experience/hooks/useDeleteExperience";

export function DeleteExperienceAction({ experienceId }: { experienceId: string }) {
  const { toast } = useToast();
  const { mutate, isPending } = useDeleteExperience();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Delete experience entry"
      >
        <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Remove this experience entry?"
        destructive
        confirmLabel="Remove"
        isConfirming={isPending}
        onConfirm={() =>
          mutate(experienceId, {
            onSuccess: () => {
              toast({ title: "Experience entry removed" });
              setOpen(false);
            },
          })
        }
      />
    </>
  );
}
