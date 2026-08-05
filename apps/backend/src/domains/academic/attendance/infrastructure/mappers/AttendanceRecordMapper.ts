import { AttendanceRecord } from "../../domain/entities/AttendanceRecord.js";
import { AttendanceMethod } from "../../domain/constants/AttendanceMethod.js";
import { AttendanceRecordStatus } from "../../domain/constants/AttendanceRecordStatus.js";
import { AttendanceCorrectionStatus } from "../../domain/constants/AttendanceCorrectionStatus.js";

import { AttendanceRecordDocument } from "../persistence/AttendanceRecordModel.js";

export class AttendanceRecordMapper {

    static toDomain(

        document: AttendanceRecordDocument

    ): AttendanceRecord {

        return AttendanceRecord.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            sessionId:
                document.sessionId.toString(),

            studentId:
                document.studentId.toString(),

            method:
                document.method as AttendanceMethod,

            status:
                document.status as AttendanceRecordStatus,

            markedAt:
                document.markedAt,

            ipAddress:
                document.ipAddress,

            userAgent:
                document.userAgent,

            latitude:
                document.latitude,

            longitude:
                document.longitude,

            markedBy:
                document.markedBy?.toString(),

            correctionStatus:
                document.correctionStatus as AttendanceCorrectionStatus | undefined,

            correctionReason:
                document.correctionReason,

            correctionReviewedBy:
                document.correctionReviewedBy?.toString()

        });

    }

    static toPersistence(

        record: AttendanceRecord

    ) {

        const data =
            record.toObject();

        return {

            organizationId:
                data.organizationId,

            sessionId:
                data.sessionId,

            studentId:
                data.studentId,

            method:
                data.method,

            status:
                data.status,

            markedAt:
                data.markedAt,

            ipAddress:
                data.ipAddress,

            userAgent:
                data.userAgent,

            latitude:
                data.latitude,

            longitude:
                data.longitude,

            markedBy:
                data.markedBy,

            correctionStatus:
                data.correctionStatus,

            correctionReason:
                data.correctionReason,

            correctionReviewedBy:
                data.correctionReviewedBy

        };

    }

}
