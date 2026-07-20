import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useDeleteCertification } from "@/features/certifications/hooks/useDeleteCertification";

export function DeleteCertificationAction({ certificationId }: { certificationId: string }) {
  const { toast } = useToast();
  const { mutate, isPending } = useDeleteCertification();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Delete certification"
      >
        <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Remove this certification?"
        destructive
        confirmLabel="Remove"
        isConfirming={isPending}
        onConfirm={() =>
          mutate(certificationId, {
            onSuccess: () => {
              toast({ title: "Certification removed" });
              setOpen(false);
            },
          })
        }
      />
    </>
  );
}
