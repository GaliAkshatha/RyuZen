import { AttendanceSession } from "../../domain/entities/AttendanceSession.js";

import { AttendanceSessionResponseDto } from "../../application/dto/AttendanceSessionResponseDto.js";

export class AttendanceSessionResponseMapper {

    static toDto(

        session: AttendanceSession

    ): AttendanceSessionResponseDto {

        return {

            id:
                session.id!,

            facultyId:
                session.facultyId,

            subject:
                session.subject,

            departmentId:
                session.departmentId,

            qrRotationSeconds:
                session.qrRotationSeconds,

            windowMinutes:
                session.windowMinutes,

            requireLocation:
                session.requireLocation,

            latitude:
                session.latitude,

            longitude:
                session.longitude,

            radiusMeters:
                session.radiusMeters,

            status:
                session.status,

            openedAt:
                session.openedAt,

            closedAt:
                session.closedAt

        };

    }

}
