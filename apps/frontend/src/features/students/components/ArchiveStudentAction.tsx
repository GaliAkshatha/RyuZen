import { useState } from "react";
import { Archive } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/hooks/useToast";

import { useArchiveStudent } from "@/features/students/hooks/useArchiveStudent";
import type { StudentResponseDto } from "@/features/students/types/student.types";

/**
 * Wrapped in a confirmation dialog — no "reactivate" endpoint exists
 * anywhere on student.routes.ts (confirmed this milestone), so
 * archiving is effectively one-way through the current API surface,
 * even if the backend's own domain model doesn't literally forbid it.
 */
export function ArchiveStudentAction({ student }: { student: StudentResponseDto }) {
  const { toast } = useToast();
  const { mutate, isPending } = useArchiveStudent(student.id);
  const [open, setOpen] = useState(false);

  if (student.status === "ARCHIVED") {
    return null;
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        <Archive className="mr-2 h-4 w-4" aria-hidden="true" />
        Archive
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Archive this student?"
        description="No reactivation action currently exists — this cannot be undone through this app."
        destructive
        confirmLabel="Archive"
        isConfirming={isPending}
        onConfirm={() =>
          mutate(undefined, {
            onSuccess: () => {
              toast({ title: "Student archived" });
              setOpen(false);
            },
          })
        }
      />
    </>
  );
}
