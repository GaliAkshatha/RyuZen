import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  AttendanceSession,
  AttendanceQrToken,
  AttendanceRecord,
  SuspiciousPattern,
  OpenAttendanceSessionRequest,
  MarkAttendanceViaQrRequest,
  MarkAttendanceManuallyRequest,
  RequestAttendanceCorrectionRequest,
  ReviewAttendanceCorrectionRequest,
} from "@/domains/attendance/attendance.types";

/** Real gap filled: /attendance existed on the backend (a real signed rotating QR-token session system with GPS proximity checks, correction workflow, and anomaly detection) with zero frontend caller. */
export const attendanceService = {
  async openSession(payload: OpenAttendanceSessionRequest): Promise<AttendanceSession> {
    const res = await apiClient.post<ApiSuccessResponse<AttendanceSession>>("/attendance/sessions", payload);
    return res.data.data;
  },

  async getSession(id: string): Promise<AttendanceSession> {
    const res = await apiClient.get<ApiSuccessResponse<AttendanceSession>>(`/attendance/sessions/${id}`);
    return res.data.data;
  },

  async getQrToken(id: string): Promise<AttendanceQrToken> {
    const res = await apiClient.get<ApiSuccessResponse<AttendanceQrToken>>(`/attendance/sessions/${id}/qr-token`);
    return res.data.data;
  },

  async markViaQr(payload: MarkAttendanceViaQrRequest): Promise<AttendanceRecord> {
    const res = await apiClient.post<ApiSuccessResponse<AttendanceRecord>>("/attendance/mark", payload);
    return res.data.data;
  },

  async markManually(sessionId: string, payload: MarkAttendanceManuallyRequest): Promise<AttendanceRecord> {
    const res = await apiClient.patch<ApiSuccessResponse<AttendanceRecord>>(`/attendance/sessions/${sessionId}/mark-manual`, payload);
    return res.data.data;
  },

  async closeSession(id: string): Promise<AttendanceSession> {
    const res = await apiClient.patch<ApiSuccessResponse<AttendanceSession>>(`/attendance/sessions/${id}/close`);
    return res.data.data;
  },

  async requestCorrection(payload: RequestAttendanceCorrectionRequest): Promise<AttendanceRecord> {
    const res = await apiClient.post<ApiSuccessResponse<AttendanceRecord>>("/attendance/corrections", payload);
    return res.data.data;
  },

  async reviewCorrection(recordId: string, payload: ReviewAttendanceCorrectionRequest): Promise<AttendanceRecord> {
    const res = await apiClient.patch<ApiSuccessResponse<AttendanceRecord>>(`/attendance/records/${recordId}/review-correction`, payload);
    return res.data.data;
  },

  async getSuspiciousPatterns(sessionId: string): Promise<SuspiciousPattern[]> {
    const res = await apiClient.get<ApiSuccessResponse<SuspiciousPattern[]>>(`/attendance/sessions/${sessionId}/suspicious-patterns`);
    return res.data.data;
  },

  async getSessionRecords(sessionId: string): Promise<AttendanceRecord[]> {
    const res = await apiClient.get<ApiSuccessResponse<AttendanceRecord[]>>(`/attendance/sessions/${sessionId}/records`);
    return res.data.data;
  },

  async getMyRecords(): Promise<AttendanceRecord[]> {
    const res = await apiClient.get<ApiSuccessResponse<AttendanceRecord[]>>("/attendance/records/me");
    return res.data.data;
  },
};
