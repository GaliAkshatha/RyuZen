import type { StudentResponseDto } from "@/features/students/types/student.types";

/** Same rationale as facultyLabels.ts — no user-lookup endpoint exists within scope, so USN/batch is the best available identifying label. */
export function studentLabel(student: StudentResponseDto): string {
  return `${student.usn} (${student.batch})`;
}

export function resolveStudentById(
  studentList: StudentResponseDto[] | undefined,
  studentId: string | undefined,
): StudentResponseDto | undefined {
  if (!studentId || !studentList) return undefined;
  return studentList.find((s) => s.id === studentId);
}
