import { AttendanceSessionStatus } from "../constants/AttendanceSessionStatus.js";

export interface IAttendanceSession {

    id?: string;

    organizationId: string;

    facultyId: string;

    /** Free text - "CS301 Data Structures, Lecture 5" - no formal Course/Class domain exists in this codebase to attach to honestly, matching how PlacementDrive already uses a free-text title. */
    subject: string;

    departmentId?: string;

    /** Real secret, generated once per session, never exposed to the client directly - only the resulting HMAC token is. See generateAttendanceQrToken.ts. */
    qrSecret: string;

    /** How many seconds a single QR token stays valid before rotating - configurable per session, not hardcoded globally. */
    qrRotationSeconds: number;

    /** The configurable attendance window - marks are only accepted between openedAt and openedAt + windowMinutes. */
    windowMinutes: number;

    requireLocation: boolean;

    latitude?: number;

    longitude?: number;

    radiusMeters?: number;

    status: AttendanceSessionStatus;

    openedAt: Date;

    closedAt?: Date;

}
