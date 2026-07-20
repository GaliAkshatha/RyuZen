import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { EmptyState } from "@/shared/components/EmptyState";
import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";

import { useClub } from "@/features/clubs/hooks/useClub";
import { useClubMembers } from "@/features/clubs/hooks/useClubMembers";
import { useUpdateClub } from "@/features/clubs/hooks/useUpdateClub";
import { useDeleteClub } from "@/features/clubs/hooks/useDeleteClub";
import { useAssignClubAdvisor } from "@/features/clubs/hooks/useAssignClubAdvisor";
import { useAddClubMember } from "@/features/clubs/hooks/useAddClubMember";
import { ClubForm } from "@/features/clubs/components/ClubForm";
import { AssignAdvisorForm } from "@/features/clubs/components/AssignAdvisorForm";
import { AddMemberForm } from "@/features/clubs/components/AddMemberForm";
import { RemoveMemberAction } from "@/features/clubs/components/RemoveMemberAction";
import { canManageClubs } from "@/features/clubs/utils/clubPermissions";

import { useFaculty } from "@/features/faculty/hooks/useFaculty";
import { facultyLabel, resolveFacultyById } from "@/features/faculty/utils/facultyLabels";
import { useStudents } from "@/features/students/hooks/useStudents";
import { studentLabel, resolveStudentById } from "@/features/students/utils/studentLabels";

export function ClubDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: club, isLoading, isError, error, refetch } = useClub(id ?? "");
  const { data: members } = useClubMembers(id ?? "");
  const { data: facultyList } = useFaculty();
  const { data: studentList } = useStudents();

  const { mutate: updateClub, isPending: isUpdating, error: updateError } = useUpdateClub(id ?? "");
  const { mutate: deleteClub, isPending: isDeleting } = useDeleteClub();
  const {
    mutate: assignAdvisor,
    isPending: isAssigningAdvisor,
    error: assignAdvisorError,
  } = useAssignClubAdvisor(id ?? "");
  const {
    mutate: addMember,
    isPending: isAddingMember,
    error: addMemberError,
  } = useAddClubMember(id ?? "");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !club) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const canManage = canManageClubs(user?.role);
  const currentAdvisor = resolveFacultyById(facultyList, club.facultyAdvisorId);

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">{club.name}</h1>
          <div className="mt-1 flex items-center gap-2">
            <StatusBadge status={club.status} />
            <span className="font-mono text-sm text-muted-foreground">{club.code}</span>
          </div>
        </div>
        {canManage && (
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-body text-sm text-foreground">
            {club.description || "No description provided."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="font-body text-sm text-muted-foreground">
            Faculty Advisor: {currentAdvisor ? facultyLabel(currentAdvisor) : "Unassigned"}
          </p>
          {members && members.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {members.map((member) => {
                const student = resolveStudentById(studentList, member.studentId);
                return (
                  <li key={member.id} className="flex items-center justify-between">
                    <span className="font-body text-sm text-foreground">
                      {student ? studentLabel(student) : member.studentId} — {member.role}
                    </span>
                    {canManage && <RemoveMemberAction clubId={club.id} memberId={member.id} />}
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              title="No members yet"
              description="Members added by an admin will appear here."
            />
          )}
        </CardContent>
      </Card>

      {canManage && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Edit Club</CardTitle>
            </CardHeader>
            <CardContent>
              <ClubForm
                club={club}
                isSubmitting={isUpdating}
                error={updateError}
                onSubmit={(values) =>
                  updateClub(values, { onSuccess: () => toast({ title: "Club updated" }) })
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Faculty Advisor</CardTitle>
            </CardHeader>
            <CardContent>
              <AssignAdvisorForm
                facultyOptions={facultyList ?? []}
                currentAdvisorId={club.facultyAdvisorId}
                isSubmitting={isAssigningAdvisor}
                error={assignAdvisorError}
                onSubmit={(values) =>
                  assignAdvisor(values, { onSuccess: () => toast({ title: "Advisor assigned" }) })
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Member</CardTitle>
            </CardHeader>
            <CardContent>
              <AddMemberForm
                studentOptions={studentList ?? []}
                isSubmitting={isAddingMember}
                error={addMemberError}
                onSubmit={(values) =>
                  addMember(values, { onSuccess: () => toast({ title: "Member added" }) })
                }
              />
            </CardContent>
          </Card>
        </>
      )}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this club?"
        description="This action cannot be undone."
        destructive
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={() =>
          deleteClub(club.id, {
            onSuccess: () => {
              toast({ title: "Club deleted" });
              navigate("/app/clubs");
            },
          })
        }
      />
    </div>
  );
}
