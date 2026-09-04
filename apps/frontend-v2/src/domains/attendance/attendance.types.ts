export const AttendanceSessionStatus = { OPEN: "OPEN", CLOSED: "CLOSED" } as const;
export type AttendanceSessionStatus = (typeof AttendanceSessionStatus)[keyof typeof AttendanceSessionStatus];

export const AttendanceRecordStatus = { PRESENT: "PRESENT", LATE: "LATE", ABSENT: "ABSENT", EXCUSED: "EXCUSED" } as const;
export type AttendanceRecordStatus = (typeof AttendanceRecordStatus)[keyof typeof AttendanceRecordStatus];

export const AttendanceMethod = { QR: "QR", MANUAL: "MANUAL", OFFLINE: "OFFLINE" } as const;
export type AttendanceMethod = (typeof AttendanceMethod)[keyof typeof AttendanceMethod];

export const AttendanceCorrectionStatus = { PENDING: "PENDING", APPROVED: "APPROVED", REJECTED: "REJECTED" } as const;
export type AttendanceCorrectionStatus = (typeof AttendanceCorrectionStatus)[keyof typeof AttendanceCorrectionStatus];

/** Matches the real backend AttendanceSessionResponseDto exactly - never includes the real qrSecret, only ever the derived rotating token via a separate endpoint. */
export interface AttendanceSession {
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

/** Matches AttendanceQrTokenResponseDto exactly. */
export interface AttendanceQrToken {
  token: string;
  expiresInSeconds: number;
}

/** Matches AttendanceRecordResponseDto exactly. */
export interface AttendanceRecord {
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

/** Matches SuspiciousPatternResponseDto exactly - flags, never blocks. */
export interface SuspiciousPattern {
  ipAddress: string;
  distinctStudentCount: number;
  studentIds: string[];
}

/** Matches OpenAttendanceSessionSchema exactly. */
export interface OpenAttendanceSessionRequest {
  subject: string;
  departmentId?: string;
  qrRotationSeconds?: number;
  windowMinutes?: number;
  requireLocation?: boolean;
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
}

/** Matches MarkAttendanceViaQrSchema exactly. */
export interface MarkAttendanceViaQrRequest {
  sessionId: string;
  token: string;
  latitude?: number;
  longitude?: number;
}

/** Matches MarkAttendanceManuallySchema exactly. */
export interface MarkAttendanceManuallyRequest {
  studentId: string;
  status: "PRESENT" | "LATE" | "ABSENT";
  method: "MANUAL" | "OFFLINE";
}

/** Matches RequestAttendanceCorrectionSchema exactly. */
export interface RequestAttendanceCorrectionRequest {
  sessionId: string;
  reason: string;
}

/** Matches ReviewAttendanceCorrectionSchema exactly. */
export interface ReviewAttendanceCorrectionRequest {
  approved: boolean;
  newStatus?: "PRESENT" | "LATE" | "EXCUSED";
}
