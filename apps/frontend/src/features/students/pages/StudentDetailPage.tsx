import { useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useToast } from "@/hooks/useToast";

import { useStudent } from "@/features/students/hooks/useStudent";
import { useUpdateStudent } from "@/features/students/hooks/useUpdateStudent";
import { useAssignMentor } from "@/features/students/hooks/useAssignMentor";
import { StudentForm } from "@/features/students/components/StudentForm";
import { AssignMentorForm } from "@/features/students/components/AssignMentorForm";
import { PromoteStudentAction } from "@/features/students/components/PromoteStudentAction";
import { ArchiveStudentAction } from "@/features/students/components/ArchiveStudentAction";

import { useDepartments } from "@/features/departments/hooks/useDepartments";
import { useFaculty } from "@/features/faculty/hooks/useFaculty";
import { facultyLabel, resolveFacultyById } from "@/features/faculty/utils/facultyLabels";

import { StudentCertificatesAndBadgesSection } from "@/features/certificates/components/StudentCertificatesAndBadgesSection";
import { StudentSkillsSection } from "@/features/skills/components/StudentSkillsSection";
import { StudentEducationSection } from "@/features/education/components/StudentEducationSection";
import { StudentExperienceSection } from "@/features/experience/components/StudentExperienceSection";

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: student, isLoading, isError, error, refetch } = useStudent(id ?? "");
  const { data: departments } = useDepartments();
  const { data: facultyList } = useFaculty();
  const {
    mutate: updateStudent,
    isPending: isUpdating,
    error: updateError,
  } = useUpdateStudent(id ?? "");
  const {
    mutate: assignMentor,
    isPending: isAssigning,
    error: assignError,
  } = useAssignMentor(id ?? "");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !student) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const currentMentor = resolveFacultyById(facultyList, student.mentorId);

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">{student.usn}</h1>
          <StatusBadge status={student.status} className="mt-1" />
        </div>
        <ArchiveStudentAction student={student} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Student</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentForm
            student={student}
            departments={departments ?? []}
            isSubmitting={isUpdating}
            error={updateError}
            onSubmit={(values) =>
              updateStudent(values, { onSuccess: () => toast({ title: "Student updated" }) })
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mentor</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="font-body text-sm text-muted-foreground">
            {currentMentor ? `Currently: ${facultyLabel(currentMentor)}` : "No mentor assigned."}
          </p>
          <AssignMentorForm
            facultyOptions={facultyList ?? []}
            currentMentorId={student.mentorId}
            isSubmitting={isAssigning}
            error={assignError}
            onSubmit={(values) =>
              assignMentor(values, { onSuccess: () => toast({ title: "Mentor assigned" }) })
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <PromoteStudentAction student={student} />
        </CardContent>
      </Card>

      <StudentCertificatesAndBadgesSection studentId={student.id} />
      <StudentSkillsSection userId={student.userId} />
      <StudentEducationSection userId={student.userId} />
      <StudentExperienceSection userId={student.userId} />
    </div>
  );
}
