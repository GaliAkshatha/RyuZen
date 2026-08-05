import { AttendanceSessionStatus } from "../../domain/constants/AttendanceSessionStatus.js";

/** Never includes qrSecret - the real secret is never exposed, only the derived rotating token via GetAttendanceQrTokenUseCase. */
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

    openedAt: Date;

    closedAt?: Date;

}
