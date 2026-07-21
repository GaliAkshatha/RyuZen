import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";

import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/enums";

import { useMentorships } from "@/features/mentorship/hooks/useMentorships";
import type { MentorshipResponseDto } from "@/features/mentorship/types/mentorship.types";

import { useStudents } from "@/features/students/hooks/useStudents";
import { studentLabel } from "@/features/students/utils/studentLabels";
import { useFaculty } from "@/features/faculty/hooks/useFaculty";
import { facultyLabel } from "@/features/faculty/utils/facultyLabels";

export function MentorshipListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: mentorships, isLoading, isError, error, refetch } = useMentorships();
  const { data: students } = useStudents();
  const { data: faculty } = useFaculty();

  const studentById = new Map((students ?? []).map((s) => [s.id, s]));
  const facultyById = new Map((faculty ?? []).map((f) => [f.id, f]));

  const columns: DataGridColumn<MentorshipResponseDto>[] = [
    {
      key: "student",
      header: "Student",
      render: (m) => {
        const student = studentById.get(m.studentId);
        return student ? studentLabel(student) : m.studentId;
      },
    },
    {
      key: "faculty",
      header: "Mentor",
      render: (m) => {
        const mentor = facultyById.get(m.facultyId);
        return mentor ? facultyLabel(mentor) : m.facultyId;
      },
    },
    { key: "status", header: "Status", render: (m) => <StatusBadge status={m.status} /> },
  ];

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Mentorships</h1>
        {user?.role === UserRole.FACULTY && (
          <div className="mt-3 flex items-start gap-2 rounded-md border border-border bg-muted/50 p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <p className="font-body text-xs text-muted-foreground">
              This list currently shows all mentorships in your organization, not only your own
              mentees. The backend does not yet provide a way for faculty to look up their own
              faculty record or filter this list to themselves.
            </p>
          </div>
        )}
      </div>

      <DataGrid
        data={mentorships ?? []}
        columns={columns}
        getRowId={(m) => m.id}
        isLoading={isLoading}
        emptyTitle="No mentorships yet"
        emptyDescription="Mentorships are created automatically when a mentor is assigned to a student."
        onRowClick={(m) => navigate(`/app/mentorship/${m.id}`)}
      />
    </div>
  );
}
