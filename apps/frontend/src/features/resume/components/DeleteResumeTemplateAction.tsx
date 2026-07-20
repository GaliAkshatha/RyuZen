import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useDeleteResumeTemplate } from "@/features/resume/hooks/useDeleteResumeTemplate";

export function DeleteResumeTemplateAction({ templateId }: { templateId: string }) {
  const { toast } = useToast();
  const { mutate, isPending } = useDeleteResumeTemplate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Delete template"
      >
        <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this template?"
        description="This removes it from the global catalog. This action cannot be undone."
        destructive
        confirmLabel="Delete"
        isConfirming={isPending}
        onConfirm={() =>
          mutate(templateId, {
            onSuccess: () => {
              toast({ title: "Template deleted" });
              setOpen(false);
            },
          })
        }
      />
    </>
  );
}
