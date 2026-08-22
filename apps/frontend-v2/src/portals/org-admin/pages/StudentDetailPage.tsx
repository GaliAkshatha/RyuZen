import { useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowUpCircle, Archive } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useStudent } from "@/domains/students/hooks/useStudent";
import { useUpdateStudent } from "@/domains/students/hooks/useUpdateStudent";
import { useAssignMentor } from "@/domains/students/hooks/useAssignMentor";
import { usePromoteSemester } from "@/domains/students/hooks/usePromoteSemester";
import { useArchiveStudent } from "@/domains/students/hooks/useArchiveStudent";
import { useFacultyList } from "@/domains/faculty/hooks/useFacultyList";
import { StudentStatus } from "@/domains/students/student.types";

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: student, isLoading, isError, error, refetch } = useStudent(id ?? "");
  const { data: faculty } = useFacultyList();
  const { mutate: updateStudent, isPending: isUpdating } = useUpdateStudent(id ?? "");
  const { mutate: assignMentor, isPending: isAssigning } = useAssignMentor(id ?? "");
  const { mutate: promoteSemester, isPending: isPromoting } = usePromoteSemester();
  const { mutate: archiveStudent, isPending: isArchiving } = useArchiveStudent();

  const [cgpa, setCgpa] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !student) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const cgpaValue = cgpa ?? student.cgpa?.toString() ?? "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{student.usn}</h1>
          <p className="text-sm text-muted-foreground">
            {student.batch} · Semester {student.semester}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={student.status} />
          {student.status === StudentStatus.ACTIVE && (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled={isPromoting}
                className="flex items-center gap-2"
                onClick={() => promoteSemester(student.id)}
              >
                <ArrowUpCircle className="h-4 w-4" aria-hidden="true" />
                Promote
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isArchiving}
                className="flex items-center gap-2 text-destructive hover:text-destructive"
                onClick={() => {
                  if (window.confirm(`Archive ${student.usn}? They will lose access.`)) {
                    archiveStudent(student.id);
                  }
                }}
              >
                <Archive className="h-4 w-4" aria-hidden="true" />
                Archive
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CGPA</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input
            type="number"
            step="0.01"
            min={0}
            max={10}
            value={cgpaValue}
            onChange={(e) => setCgpa(e.target.value)}
            placeholder="Not recorded"
          />
          <Button
            size="sm"
            className="w-fit"
            disabled={isUpdating || Number(cgpaValue) === student.cgpa}
            onClick={() => updateStudent({ cgpa: Number(cgpaValue) })}
          >
            {isUpdating ? "Saving…" : "Save"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mentor</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="student-mentor" className="sr-only">
            Mentor
          </Label>
          <Select
            value={student.mentorId}
            onValueChange={(facultyId) => assignMentor({ facultyId })}
            disabled={isAssigning}
          >
            <SelectTrigger id="student-mentor" className="max-w-xs">
              <SelectValue placeholder="No mentor assigned" />
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
    </div>
  );
}
