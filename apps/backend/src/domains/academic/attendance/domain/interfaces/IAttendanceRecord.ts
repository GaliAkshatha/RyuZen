import { AttendanceMethod } from "../constants/AttendanceMethod.js";
import { AttendanceRecordStatus } from "../constants/AttendanceRecordStatus.js";
import { AttendanceCorrectionStatus } from "../constants/AttendanceCorrectionStatus.js";

export interface IAttendanceRecord {

    id?: string;

    organizationId: string;

    sessionId: string;

    studentId: string;

    method: AttendanceMethod;

    status: AttendanceRecordStatus;

    markedAt: Date;

    /** Real fraud-detection surface - same IP/device marking many different students in one session is the obvious anomaly signal (see findSuspiciousAttendancePatterns.ts). Never fabricated as a device fingerprint - just what's genuinely observable from a request (IP, User-Agent). */
    ipAddress?: string;

    userAgent?: string;

    latitude?: number;

    longitude?: number;

    /** Faculty override / manual marking records who actually did it - never silently attributed to the student themselves when a faculty member marked it on their behalf. */
    markedBy?: string;

    correctionStatus?: AttendanceCorrectionStatus;

    correctionReason?: string;

    correctionReviewedBy?: string;

}
