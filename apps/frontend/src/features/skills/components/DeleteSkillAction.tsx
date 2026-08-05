import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useDeleteSkill } from "@/features/skills/hooks/useDeleteSkill";

interface DeleteSkillActionProps {
  skillId: string;
  title?: string;
  confirmLabel?: string;
  successMessage?: string;
}

export function DeleteSkillAction({
  skillId,
  title = "Remove this skill?",
  confirmLabel = "Remove",
  successMessage = "Skill removed",
}: DeleteSkillActionProps) {
  const { toast } = useToast();
  const { mutate, isPending } = useDeleteSkill();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Delete skill">
        <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        destructive
        confirmLabel={confirmLabel}
        isConfirming={isPending}
        onConfirm={() =>
          mutate(skillId, {
            onSuccess: () => {
              toast({ title: successMessage });
              setOpen(false);
            },
          })
        }
      />
    </>
  );
}
