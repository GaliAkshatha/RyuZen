import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { attendanceService } from "@/domains/attendance/attendanceService";
import type { SuspiciousPattern } from "@/domains/attendance/attendance.types";

export function useSuspiciousPatterns(sessionId: string) {
  return useApiQuery<SuspiciousPattern[]>({
    queryKey: ["attendance", "sessions", sessionId, "suspicious-patterns"] as const,
    queryFn: () => attendanceService.getSuspiciousPatterns(sessionId),
    enabled: Boolean(sessionId),
  });
}
