import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Trash2, UserPlus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { useClub } from "@/domains/clubs/hooks/useClub";
import { useClubMembers } from "@/domains/clubs/hooks/useClubMembers";
import { useAssignAdvisor, useAddClubMember, useRemoveClubMember } from "@/domains/clubs/hooks/useClubMutations";
import { useFacultyList } from "@/domains/faculty/hooks/useFacultyList";
import { useStudentList } from "@/domains/students/hooks/useStudentList";

export function ClubDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: club, isLoading, isError, error, refetch } = useClub(id ?? "");
  const { data: members } = useClubMembers(id ?? "");
  const { data: faculty } = useFacultyList();
  const { data: students } = useStudentList();
  const { mutate: assignAdvisor, isPending: isAssigning } = useAssignAdvisor(id ?? "");
  const { mutate: addMember, isPending: isAdding } = useAddClubMember(id ?? "");
  const { mutate: removeMember, isPending: isRemoving, variables: removingId } = useRemoveClubMember(id ?? "");
  const [selectedStudent, setSelectedStudent] = useState("");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !club) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const memberStudentIds = new Set((members ?? []).map((m) => m.studentId));
  const availableStudents = (students ?? []).filter((s) => !memberStudentIds.has(s.id));

  function studentLabel(studentId: string) {
    const s = (students ?? []).find((st) => st.id === studentId);
    return s ? s.usn : studentId;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link to="/organization/clubs" className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{club.name}</h1>
          <p className="text-sm text-muted-foreground">{club.code}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faculty advisor</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={club.facultyAdvisorId} onValueChange={(facultyId) => assignAdvisor({ facultyId })} disabled={isAssigning}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="No advisor assigned" />
            </SelectTrigger>
            <SelectContent>
              {(faculty ?? []).map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.designation} ({f.employeeId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members ({members?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="Choose a student…" />
              </SelectTrigger>
              <SelectContent>
                {availableStudents.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.usn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              disabled={!selectedStudent || isAdding}
              onClick={() => {
                addMember({ studentId: selectedStudent });
                setSelectedStudent("");
              }}
              className="flex items-center gap-1.5"
            >
              <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
              Add
            </Button>
          </div>

          {!members || members.length === 0 ? (
            <EmptyState title="No members yet" />
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2 text-sm">
                  <div>
                    <span className="font-medium text-foreground">{studentLabel(m.studentId)}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{m.role}</span>
                  </div>
                  <button
                    onClick={() => removeMember(m.id)}
                    disabled={isRemoving && removingId === m.id}
                    aria-label="Remove member"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
