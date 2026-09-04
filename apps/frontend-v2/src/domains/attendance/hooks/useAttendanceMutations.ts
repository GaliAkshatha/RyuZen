import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { attendanceService } from "@/domains/attendance/attendanceService";
import type {
  AttendanceSession,
  AttendanceRecord,
  OpenAttendanceSessionRequest,
  MarkAttendanceViaQrRequest,
  MarkAttendanceManuallyRequest,
  RequestAttendanceCorrectionRequest,
  ReviewAttendanceCorrectionRequest,
} from "@/domains/attendance/attendance.types";

export function useOpenAttendanceSession() {
  return useApiMutation<AttendanceSession, OpenAttendanceSessionRequest>({
    mutationFn: (payload) => attendanceService.openSession(payload),
  });
}

export function useMarkAttendanceViaQr() {
  const queryClient = useQueryClient();
  return useApiMutation<AttendanceRecord, MarkAttendanceViaQrRequest>({
    mutationFn: (payload) => attendanceService.markViaQr(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance", "records", "me"] }),
  });
}

export function useMarkAttendanceManually(sessionId: string) {
  const queryClient = useQueryClient();
  return useApiMutation<AttendanceRecord, MarkAttendanceManuallyRequest>({
    mutationFn: (payload) => attendanceService.markManually(sessionId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance", "sessions", sessionId, "records"] }),
  });
}

export function useCloseAttendanceSession(sessionId: string) {
  const queryClient = useQueryClient();
  return useApiMutation<AttendanceSession, void>({
    mutationFn: () => attendanceService.closeSession(sessionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance", "sessions", sessionId] }),
  });
}

export function useRequestAttendanceCorrection() {
  const queryClient = useQueryClient();
  return useApiMutation<AttendanceRecord, RequestAttendanceCorrectionRequest>({
    mutationFn: (payload) => attendanceService.requestCorrection(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance", "records", "me"] }),
  });
}

export function useReviewAttendanceCorrection(sessionId: string) {
  const queryClient = useQueryClient();
  return useApiMutation<AttendanceRecord, { recordId: string; payload: ReviewAttendanceCorrectionRequest }>({
    mutationFn: ({ recordId, payload }) => attendanceService.reviewCorrection(recordId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance", "sessions", sessionId, "records"] }),
  });
}
