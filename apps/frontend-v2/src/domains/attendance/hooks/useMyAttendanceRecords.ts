import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { attendanceService } from "@/domains/attendance/attendanceService";
import type { AttendanceRecord } from "@/domains/attendance/attendance.types";

export function useMyAttendanceRecords() {
  return useApiQuery<AttendanceRecord[]>({
    queryKey: ["attendance", "records", "me"] as const,
    queryFn: attendanceService.getMyRecords,
  });
}
