import { AttendanceSession } from "../../domain/entities/AttendanceSession.js";
import { AttendanceSessionStatus } from "../../domain/constants/AttendanceSessionStatus.js";

import { AttendanceSessionDocument } from "../persistence/AttendanceSessionModel.js";

export class AttendanceSessionMapper {

    static toDomain(

        document: AttendanceSessionDocument

    ): AttendanceSession {

        return AttendanceSession.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            facultyId:
                document.facultyId.toString(),

            subject:
                document.subject,

            departmentId:
                document.departmentId?.toString(),

            qrSecret:
                document.qrSecret,

            qrRotationSeconds:
                document.qrRotationSeconds,

            windowMinutes:
                document.windowMinutes,

            requireLocation:
                document.requireLocation,

            latitude:
                document.latitude,

            longitude:
                document.longitude,

            radiusMeters:
                document.radiusMeters,

            status:
                document.status as AttendanceSessionStatus,

            openedAt:
                document.openedAt,

            closedAt:
                document.closedAt

        });

    }

    static toPersistence(

        session: AttendanceSession

    ) {

        const data =
            session.toObject();

        return {

            organizationId:
                data.organizationId,

            facultyId:
                data.facultyId,

            subject:
                data.subject,

            departmentId:
                data.departmentId,

            qrSecret:
                data.qrSecret,

            qrRotationSeconds:
                data.qrRotationSeconds,

            windowMinutes:
                data.windowMinutes,

            requireLocation:
                data.requireLocation,

            latitude:
                data.latitude,

            longitude:
                data.longitude,

            radiusMeters:
                data.radiusMeters,

            status:
                data.status,

            openedAt:
                data.openedAt,

            closedAt:
                data.closedAt

        };

    }

}
