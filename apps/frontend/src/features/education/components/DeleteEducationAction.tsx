import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useDeleteEducation } from "@/features/education/hooks/useDeleteEducation";

export function DeleteEducationAction({ educationId }: { educationId: string }) {
  const { toast } = useToast();
  const { mutate, isPending } = useDeleteEducation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Delete education entry"
      >
        <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Remove this education entry?"
        destructive
        confirmLabel="Remove"
        isConfirming={isPending}
        onConfirm={() =>
          mutate(educationId, {
            onSuccess: () => {
              toast({ title: "Education entry removed" });
              setOpen(false);
            },
          })
        }
      />
    </>
  );
}
