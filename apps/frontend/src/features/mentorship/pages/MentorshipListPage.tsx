import { useNavigate } from "react-router-dom";

import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/enums";

import { useMentorships } from "@/features/mentorship/hooks/useMentorships";
import type { MentorshipResponseDto } from "@/features/mentorship/types/mentorship.types";

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
  // useFaculty() (GET /faculty) is SUPER_ADMIN/ORG_ADMIN-only - only
  // fetched for Org Admin's view, which genuinely needs to resolve
  // multiple different mentors' names. A Faculty caller's own
  // mentorships are always their own mentor identity, so the Mentor
  // column is redundant for them and hidden entirely below, rather
  // than calling an endpoint that would just 403 for no real reason.
  const { data: faculty } = useFaculty({ enabled: !isFaculty });

  const facultyById = new Map((faculty ?? []).map((f) => [f.id, f]));

  const columns: DataGridColumn<MentorshipResponseDto>[] = [
    {
      key: "student",
      header: "Student",
      // Enriched server-side (GetMentorshipsUseCase) - Faculty cannot
      // call GET /students to resolve this themselves, the same real
      // gap already fixed for Leaderboard.
      render: (m) => m.studentName ?? m.studentId,
    },
    ...(isFaculty
      ? []
      : [
          {
            key: "faculty",
            header: "Mentor",
            render: (m: MentorshipResponseDto) => {
              const mentor = facultyById.get(m.facultyId);
              return mentor ? facultyLabel(mentor) : m.facultyId;
            },
          } satisfies DataGridColumn<MentorshipResponseDto>,
        ]),
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
