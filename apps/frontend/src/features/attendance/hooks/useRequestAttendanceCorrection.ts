import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { attendanceService } from "@/features/attendance/services/attendance.service";
import type {
  AttendanceRecordResponseDto,
  RequestAttendanceCorrectionPayload,
} from "@/features/attendance/types/attendance.types";

export function useRequestAttendanceCorrection() {
  const queryClient = useQueryClient();

  return useApiMutation<AttendanceRecordResponseDto, RequestAttendanceCorrectionPayload>({
    mutationFn: (payload) => attendanceService.requestCorrection(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "my-records"] });
    },
  });
}
