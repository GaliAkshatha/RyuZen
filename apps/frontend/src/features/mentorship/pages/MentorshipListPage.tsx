import { useNavigate } from "react-router-dom";

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
import { useMyFacultyProfile } from "@/features/faculty/hooks/useMyFacultyProfile";
import { facultyLabel } from "@/features/faculty/utils/facultyLabels";

export function MentorshipListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isFaculty = user?.role === UserRole.FACULTY;

  // Real self-scoping now, not just a disclaimer: a faculty caller's
  // own facultyId is resolved server-side (GetMyFacultyProfileUseCase)
  // and used to genuinely filter this list to their own mentees.
  const { data: myFacultyProfile } = useMyFacultyProfile();
  const { data: mentorships, isLoading, isError, error, refetch } = useMentorships(
    isFaculty && myFacultyProfile ? { facultyId: myFacultyProfile.id } : undefined,
  );
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
      <h1 className="font-display text-2xl font-semibold text-foreground">
        {isFaculty ? "My Mentees" : "Mentorships"}
      </h1>

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
