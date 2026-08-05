import { useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useToast } from "@/hooks/useToast";

import { useMentorship } from "@/features/mentorship/hooks/useMentorship";
import { useUpdateMentorship } from "@/features/mentorship/hooks/useUpdateMentorship";
import { MentorshipRemarksForm } from "@/features/mentorship/components/MentorshipRemarksForm";
import { CompleteMentorshipAction } from "@/features/mentorship/components/CompleteMentorshipAction";
import { CancelMentorshipAction } from "@/features/mentorship/components/CancelMentorshipAction";

import { useStudents } from "@/features/students/hooks/useStudents";
import { studentLabel } from "@/features/students/utils/studentLabels";
import { useFaculty } from "@/features/faculty/hooks/useFaculty";
import { facultyLabel } from "@/features/faculty/utils/facultyLabels";

export function MentorshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: mentorship, isLoading, isError, error, refetch } = useMentorship(id ?? "");
  const { data: students } = useStudents();
  const { data: faculty } = useFaculty();
  const { mutate: updateMentorship, isPending, error: updateError } = useUpdateMentorship(id ?? "");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !mentorship) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const student = students?.find((s) => s.id === mentorship.studentId);
  const mentor = faculty?.find((f) => f.id === mentorship.facultyId);

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            {student ? studentLabel(student) : mentorship.studentId}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <StatusBadge status={mentorship.status} />
            <span className="font-body text-sm text-muted-foreground">
              Mentor: {mentor ? facultyLabel(mentor) : mentorship.facultyId}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <CompleteMentorshipAction mentorship={mentorship} />
          <CancelMentorshipAction mentorship={mentorship} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Remarks</CardTitle>
        </CardHeader>
        <CardContent>
          <MentorshipRemarksForm
            currentRemarks={mentorship.remarks}
            isSubmitting={isPending}
            error={updateError}
            onSubmit={(values) =>
              updateMentorship(values, { onSuccess: () => toast({ title: "Remarks saved" }) })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
