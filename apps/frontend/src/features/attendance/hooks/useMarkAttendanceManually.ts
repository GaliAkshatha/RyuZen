import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { attendanceService } from "@/features/attendance/services/attendance.service";
import type {
  AttendanceRecordResponseDto,
  MarkAttendanceManuallyPayload,
} from "@/features/attendance/types/attendance.types";

export function useMarkAttendanceManually(sessionId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<AttendanceRecordResponseDto, MarkAttendanceManuallyPayload>({
    mutationFn: (payload) => attendanceService.markManually(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "session-records", sessionId] });
    },
  });
}
