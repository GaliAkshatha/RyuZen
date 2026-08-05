import { useApiMutation } from "@/hooks/useApiMutation";

import { attendanceService } from "@/features/attendance/services/attendance.service";
import type {
  AttendanceRecordResponseDto,
  MarkAttendanceViaQrPayload,
} from "@/features/attendance/types/attendance.types";

export function useMarkAttendanceViaQr() {
  return useApiMutation<AttendanceRecordResponseDto, MarkAttendanceViaQrPayload>({
    mutationFn: (payload) => attendanceService.markViaQr(payload),
  });
}
