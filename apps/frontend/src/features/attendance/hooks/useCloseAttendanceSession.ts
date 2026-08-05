import { useApiMutation } from "@/hooks/useApiMutation";

import { attendanceService } from "@/features/attendance/services/attendance.service";
import type { AttendanceSessionResponseDto } from "@/features/attendance/types/attendance.types";

export function useCloseAttendanceSession() {
  return useApiMutation<AttendanceSessionResponseDto, string>({
    mutationFn: (sessionId) => attendanceService.closeSession(sessionId),
  });
}
