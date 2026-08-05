import { useApiMutation } from "@/hooks/useApiMutation";

import { attendanceService } from "@/features/attendance/services/attendance.service";
import type {
  AttendanceRecordResponseDto,
  ReviewAttendanceCorrectionPayload,
} from "@/features/attendance/types/attendance.types";

export function useReviewAttendanceCorrection() {
  return useApiMutation<
    AttendanceRecordResponseDto,
    { recordId: string; payload: ReviewAttendanceCorrectionPayload }
  >({
    mutationFn: ({ recordId, payload }) => attendanceService.reviewCorrection(recordId, payload),
  });
}
