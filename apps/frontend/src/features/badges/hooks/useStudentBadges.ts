import { useApiQuery } from "@/hooks/useApiQuery";

import { badgeService } from "@/features/badges/services/badge.service";

export function useStudentBadges(studentId: string) {
  return useApiQuery({
    queryKey: ["badges", "students", studentId] as const,
    queryFn: () => badgeService.listForStudent(studentId),
    enabled: Boolean(studentId),
  });
}
