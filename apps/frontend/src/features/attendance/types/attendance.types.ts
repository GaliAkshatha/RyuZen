export type AttendanceSessionStatus = "OPEN" | "CLOSED";
export type AttendanceRecordStatus = "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";
export type AttendanceMethod = "QR" | "MANUAL" | "OFFLINE";
export type AttendanceCorrectionStatus = "PENDING" | "APPROVED" | "REJECTED";

/** Mirrors AttendanceSessionResponseDto exactly - never includes the real qrSecret. */
export interface AttendanceSessionResponseDto {
  id: string;
  facultyId: string;
  subject: string;
  departmentId?: string;
  qrRotationSeconds: number;
  windowMinutes: number;
  requireLocation: boolean;
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
  status: AttendanceSessionStatus;
  openedAt: string;
  closedAt?: string;
}

export interface OpenAttendanceSessionPayload {
  subject: string;
  departmentId?: string;
  qrRotationSeconds?: number;
  windowMinutes?: number;
  requireLocation?: boolean;
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
}

/** Mirrors AttendanceQrTokenResponseDto - the real, current rotating token, never the session's secret. */
export interface AttendanceQrTokenResponseDto {
  token: string;
  expiresInSeconds: number;
}

export interface MarkAttendanceViaQrPayload {
  sessionId: string;
  token: string;
  latitude?: number;
  longitude?: number;
}

export interface MarkAttendanceManuallyPayload {
  studentId: string;
  status: AttendanceRecordStatus;
  method: AttendanceMethod;
}

/** Mirrors AttendanceRecordResponseDto exactly. */
export interface AttendanceRecordResponseDto {
  id: string;
  sessionId: string;
  studentId: string;
  method: AttendanceMethod;
  status: AttendanceRecordStatus;
  markedAt: string;
  markedBy?: string;
  correctionStatus?: AttendanceCorrectionStatus;
  correctionReason?: string;
  correctionReviewedBy?: string;
}

export interface RequestAttendanceCorrectionPayload {
  sessionId: string;
  reason: string;
}

export interface ReviewAttendanceCorrectionPayload {
  approved: boolean;
  newStatus?: AttendanceRecordStatus;
}

export interface SuspiciousPatternResponseDto {
  ipAddress: string;
  distinctStudentCount: number;
  studentIds: string[];
}
