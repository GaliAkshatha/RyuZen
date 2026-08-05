import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AttendanceSessionResponseDto,
  OpenAttendanceSessionPayload,
  AttendanceQrTokenResponseDto,
  MarkAttendanceViaQrPayload,
  MarkAttendanceManuallyPayload,
  AttendanceRecordResponseDto,
  RequestAttendanceCorrectionPayload,
  ReviewAttendanceCorrectionPayload,
  SuspiciousPatternResponseDto,
} from "@/features/attendance/types/attendance.types";

export const attendanceService = {
  openSession(payload: OpenAttendanceSessionPayload): Promise<AttendanceSessionResponseDto> {
    return apiClient
      .post<AttendanceSessionResponseDto>(`${API_ENDPOINTS.attendance}/sessions`, payload)
      .then((response) => response.data);
  },

  /** The real, current rotating token - re-fetched at the session's own real cadence, never generated client-side. */
  getQrToken(sessionId: string): Promise<AttendanceQrTokenResponseDto> {
    return apiClient
      .get<AttendanceQrTokenResponseDto>(`${API_ENDPOINTS.attendance}/sessions/${sessionId}/qr-token`)
      .then((response) => response.data);
  },

  markViaQr(payload: MarkAttendanceViaQrPayload): Promise<AttendanceRecordResponseDto> {
    return apiClient
      .post<AttendanceRecordResponseDto>(`${API_ENDPOINTS.attendance}/mark`, payload)
      .then((response) => response.data);
  },

  markManually(
    sessionId: string,
    payload: MarkAttendanceManuallyPayload,
  ): Promise<AttendanceRecordResponseDto> {
    return apiClient
      .patch<AttendanceRecordResponseDto>(
        `${API_ENDPOINTS.attendance}/sessions/${sessionId}/mark-manual`,
        payload,
      )
      .then((response) => response.data);
  },

  closeSession(sessionId: string): Promise<AttendanceSessionResponseDto> {
    return apiClient
      .patch<AttendanceSessionResponseDto>(`${API_ENDPOINTS.attendance}/sessions/${sessionId}/close`, {})
      .then((response) => response.data);
  },

  requestCorrection(
    payload: RequestAttendanceCorrectionPayload,
  ): Promise<AttendanceRecordResponseDto> {
    return apiClient
      .post<AttendanceRecordResponseDto>(`${API_ENDPOINTS.attendance}/corrections`, payload)
      .then((response) => response.data);
  },

  reviewCorrection(
    recordId: string,
    payload: ReviewAttendanceCorrectionPayload,
  ): Promise<AttendanceRecordResponseDto> {
    return apiClient
      .patch<AttendanceRecordResponseDto>(
        `${API_ENDPOINTS.attendance}/records/${recordId}/review-correction`,
        payload,
      )
      .then((response) => response.data);
  },

  getSuspiciousPatterns(sessionId: string): Promise<SuspiciousPatternResponseDto[]> {
    return apiClient
      .get<SuspiciousPatternResponseDto[]>(
        `${API_ENDPOINTS.attendance}/sessions/${sessionId}/suspicious-patterns`,
      )
      .then((response) => response.data);
  },

  getSessionRecords(sessionId: string): Promise<AttendanceRecordResponseDto[]> {
    return apiClient
      .get<AttendanceRecordResponseDto[]>(`${API_ENDPOINTS.attendance}/sessions/${sessionId}/records`)
      .then((response) => response.data);
  },

  getMyRecords(): Promise<AttendanceRecordResponseDto[]> {
    return apiClient
      .get<AttendanceRecordResponseDto[]>(`${API_ENDPOINTS.attendance}/records/me`)
      .then((response) => response.data);
  },
};
