import { CheckCircle2, Circle } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { Badge } from "@/shared/ui/Badge";

import { useMarkAttendance } from "@/features/events/hooks/useMarkAttendance";
import type { EventRegistrationResponseDto } from "@/features/events/types/event.types";

import { useStudents } from "@/features/students/hooks/useStudents";
import { studentLabel, resolveStudentById } from "@/features/students/utils/studentLabels";

/** Marks attendance ONE student at a time — MarkAttendanceDto takes a single studentId, not a bulk list, confirmed this milestone. */
export function MarkAttendanceList({
  eventId,
  registrations,
}: {
  eventId: string;
  registrations: EventRegistrationResponseDto[];
}) {
  const { data: students } = useStudents();
  const { mutate, isPending } = useMarkAttendance(eventId);

  if (registrations.length === 0) {
    return (
      <EmptyState
        title="No registrations yet"
        description="Students who register will appear here."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {registrations.map((registration) => {
        const student = resolveStudentById(students, registration.studentId);
        return (
          <li key={registration.id} className="flex items-center justify-between gap-2">
            <span className="font-body text-sm text-foreground">
              {student ? studentLabel(student) : registration.studentId}
            </span>
            <div className="flex items-center gap-2">
              {registration.certificateIssued && (
                <Badge variant="success">Certificate issued</Badge>
              )}
              <Button
                size="sm"
                variant={registration.attendance ? "outline" : "default"}
                disabled={isPending}
                onClick={() =>
                  mutate({ studentId: registration.studentId, attended: !registration.attendance })
                }
              >
                {registration.attendance ? (
                  <CheckCircle2 className="mr-2 h-4 w-4 text-success" aria-hidden="true" />
                ) : (
                  <Circle className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                {registration.attendance ? "Attended" : "Mark Attended"}
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
