import { useApiMutation } from "@/hooks/useApiMutation";

import { attendanceService } from "@/features/attendance/services/attendance.service";
import type {
  AttendanceSessionResponseDto,
  OpenAttendanceSessionPayload,
} from "@/features/attendance/types/attendance.types";

export function useOpenAttendanceSession() {
  return useApiMutation<AttendanceSessionResponseDto, OpenAttendanceSessionPayload>({
    mutationFn: (payload) => attendanceService.openSession(payload),
  });
}
