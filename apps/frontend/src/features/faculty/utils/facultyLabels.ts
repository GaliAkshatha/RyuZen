import type { FacultyResponseDto } from "@/features/faculty/types/faculty.types";

/**
 * Neither FacultyResponseDto nor DepartmentResponseDto carries a
 * person's display name — both only reference `userId`. No user-lookup
 * endpoint exists within this milestone's scope (Users & Permissions
 * Management is AD1, much later in the roadmap). This resolves the
 * best available identifying label from data already on hand.
 */
export function facultyLabel(faculty: FacultyResponseDto): string {
  return `${faculty.employeeId} — ${faculty.designation}`;
}

export function resolveFacultyByUserId(
  facultyList: FacultyResponseDto[] | undefined,
  userId: string | undefined,
): FacultyResponseDto | undefined {
  if (!userId || !facultyList) return undefined;
  return facultyList.find((f) => f.userId === userId);
}

/**
 * Student.mentorId (and AssignMentorDto.facultyId) reference a Faculty
 * entity's own `id` directly — confirmed against AssignMentorUseCase,
 * which stores `dto.facultyId` as-is, unlike Department's
 * headOfDepartmentId which references a userId instead. Two distinct
 * resolvers since the two backend modules genuinely use different
 * reference conventions.
 */
export function resolveFacultyById(
  facultyList: FacultyResponseDto[] | undefined,
  facultyId: string | undefined,
): FacultyResponseDto | undefined {
  if (!facultyId || !facultyList) return undefined;
  return facultyList.find((f) => f.id === facultyId);
}
