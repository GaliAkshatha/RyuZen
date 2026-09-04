import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { badgeService } from "@/domains/badges/badgeService";
import type { StudentBadge } from "@/domains/badges/badge.types";

export function useStudentBadges(studentId: string) {
  return useApiQuery<StudentBadge[]>({
    queryKey: ["badges", "student", studentId] as const,
    queryFn: () => badgeService.listForStudent(studentId),
    enabled: Boolean(studentId),
  });
}
