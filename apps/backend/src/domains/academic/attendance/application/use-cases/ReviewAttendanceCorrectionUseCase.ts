import { IAttendanceRecordRepository } from "../../infrastructure/repositories/IAttendanceRecordRepository.js";

import { AttendanceRecordResponseMapper } from "../../infrastructure/mappers/AttendanceRecordResponseMapper.js";

import { ReviewAttendanceCorrectionDto } from "../dto/ReviewAttendanceCorrectionDto.js";
import { AttendanceRecordResponseDto } from "../dto/AttendanceRecordResponseDto.js";

import {
    IStudentRepository,
} from "../../../students/infrastructure/repositories/IStudentRepository.js";

import { RecordSystemNotificationUseCase } from "../../../../communication/notifications/application/use-cases/RecordSystemNotificationUseCase.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class ReviewAttendanceCorrectionUseCase {

    constructor(

        private readonly recordRepository: IAttendanceRecordRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly recordSystemNotification: RecordSystemNotificationUseCase

    ) {}

    async execute(

        recordId: string,

        organizationId: string,

        dto: ReviewAttendanceCorrectionDto,

        reviewedBy: string

    ): Promise<AttendanceRecordResponseDto> {

        const record =

            await this.recordRepository.findById(
                recordId
            );

        if (

            !record ||
            record.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Attendance record not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (dto.approved && !dto.newStatus) {

            throw new ApiError(

                "An approved correction requires the resulting status.",

                HttpStatus.BAD_REQUEST

            );

        }

        record.reviewCorrection(

            dto.approved,

            reviewedBy,

            dto.newStatus

        );

        const updated =

            await this.recordRepository.save(
                record
            );

        const student =

            await this.studentRepository.findById(
                updated.studentId
            );

        if (student) {

            await this.recordSystemNotification.execute({

                organizationId,

                recipientUserId:
                    student.userId,

                senderId:
                    reviewedBy,

                title:
                    dto.approved ? "Attendance correction approved" : "Attendance correction rejected",

                message:
                    dto.approved
                        ? `Your attendance correction request has been approved.`
                        : `Your attendance correction request has been rejected.`

            }).catch(() => {
                // A notification failure must never break a real, already-recorded review decision.
            });

        }

        return AttendanceRecordResponseMapper.toDto(

            updated

        );

    }

}
