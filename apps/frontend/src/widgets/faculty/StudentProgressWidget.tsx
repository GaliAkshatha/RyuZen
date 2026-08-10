import { Users } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { useMyFacultyProfile } from "@/features/faculty/hooks/useMyFacultyProfile";
import { useMentorships } from "@/features/mentorship/hooks/useMentorships";

/**
 * Now genuinely wired - GetMyFacultyProfileUseCase (real backend
 * addition) resolves the caller's own Faculty.id, which
 * GetMentorshipsUseCase already supported filtering by. The gap
 * documented here previously (no way for faculty to discover their
 * own facultyId) is closed; this shows a real count of this faculty
 * member's own active mentees, not a placeholder.
 */
export function StudentProgressWidget() {
  const { data: myFacultyProfile, isLoading: isLoadingProfile } = useMyFacultyProfile();
  const { data: mentorships, isLoading: isLoadingMentorships } = useMentorships(
    myFacultyProfile ? { facultyId: myFacultyProfile.id, status: "ACTIVE" } : undefined,
  );

  const isLoading = isLoadingProfile || (!!myFacultyProfile && isLoadingMentorships);

  return (
    <WidgetCard title="Student Progress" icon={Users} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : !myFacultyProfile ? (
        <p className="font-body text-sm text-muted-foreground">
          No faculty profile is linked to your account yet.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="font-display text-2xl font-bold leading-none text-foreground">
            {(mentorships ?? []).length}
          </p>
          <p className="font-body text-xs text-muted-foreground">Active mentees</p>
        </div>
      )}
    </WidgetCard>
  );
}
