import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useDeletePortfolioProject } from "@/features/portfolio/hooks/useDeletePortfolioProject";

export function DeletePortfolioProjectAction({ projectId }: { projectId: string }) {
  const { toast } = useToast();
  const { mutate, isPending } = useDeletePortfolioProject();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Delete project">
        <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Remove this project?"
        destructive
        confirmLabel="Remove"
        isConfirming={isPending}
        onConfirm={() =>
          mutate(projectId, {
            onSuccess: () => {
              toast({ title: "Project removed" });
              setOpen(false);
            },
          })
        }
      />
    </>
  );
}
