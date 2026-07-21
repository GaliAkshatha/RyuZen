import { ArrowUpCircle } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { useToast } from "@/hooks/useToast";

import { usePromoteStudent } from "@/features/students/hooks/usePromoteStudent";
import type { StudentResponseDto } from "@/features/students/types/student.types";

export function PromoteStudentAction({ student }: { student: StudentResponseDto }) {
  const { toast } = useToast();
  const { mutate, isPending, error } = usePromoteStudent(student.id);

  const isArchived = student.status === "ARCHIVED";

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={isPending || isArchived}
        onClick={() =>
          mutate(undefined, {
            onSuccess: (updated) =>
              toast({
                title: "Student promoted",
                description: `Now in semester ${updated.semester}.`,
              }),
          })
        }
      >
        <ArrowUpCircle className="mr-2 h-4 w-4" aria-hidden="true" />
        Promote to Next Semester
      </Button>
      {isArchived && (
        <p className="font-body text-xs text-muted-foreground">
          Cannot promote an archived student.
        </p>
      )}
      {error && <p className="font-body text-xs text-destructive">{error.message}</p>}
    </div>
  );
}
