import { AttendanceRecord } from "../../domain/entities/AttendanceRecord.js";

import { AttendanceRecordResponseDto } from "../../application/dto/AttendanceRecordResponseDto.js";

export class AttendanceRecordResponseMapper {

    static toDto(

        record: AttendanceRecord

    ): AttendanceRecordResponseDto {

        return {

            id:
                record.id!,

            sessionId:
                record.sessionId,

            studentId:
                record.studentId,

            method:
                record.method,

            status:
                record.status,

            markedAt:
                record.markedAt,

            markedBy:
                record.markedBy,

            correctionStatus:
                record.correctionStatus,

            correctionReason:
                record.correctionReason,

            correctionReviewedBy:
                record.correctionReviewedBy

        };

    }

}
