import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { attendanceService } from "@/domains/attendance/attendanceService";
import type { AttendanceSession } from "@/domains/attendance/attendance.types";

export function useAttendanceSession(id: string) {
  return useApiQuery<AttendanceSession>({
    queryKey: ["attendance", "sessions", id] as const,
    queryFn: () => attendanceService.getSession(id),
    enabled: Boolean(id),
  });
}
