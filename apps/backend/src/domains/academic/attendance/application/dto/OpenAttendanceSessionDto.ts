export interface OpenAttendanceSessionDto {

    subject: string;

    departmentId?: string;

    qrRotationSeconds?: number;

    windowMinutes?: number;

    requireLocation?: boolean;

    latitude?: number;

    longitude?: number;

    radiusMeters?: number;

}
