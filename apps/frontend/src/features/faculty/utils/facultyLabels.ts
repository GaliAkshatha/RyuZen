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
