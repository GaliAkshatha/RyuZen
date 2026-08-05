import { useApiQuery } from "@/hooks/useApiQuery";

import { attendanceService } from "@/features/attendance/services/attendance.service";

export function useSuspiciousPatterns(sessionId: string) {
  return useApiQuery({
    queryKey: ["attendance", "suspicious-patterns", sessionId],
    queryFn: () => attendanceService.getSuspiciousPatterns(sessionId),
  });
}
