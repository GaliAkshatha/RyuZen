import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { attendanceService } from "@/domains/attendance/attendanceService";
import type { AttendanceRecord } from "@/domains/attendance/attendance.types";

export function useSessionRecords(sessionId: string) {
  return useApiQuery<AttendanceRecord[]>({
    queryKey: ["attendance", "sessions", sessionId, "records"] as const,
    queryFn: () => attendanceService.getSessionRecords(sessionId),
    enabled: Boolean(sessionId),
  });
}
