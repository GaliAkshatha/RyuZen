import { IAttendanceSessionRepository } from "../../infrastructure/repositories/IAttendanceSessionRepository.js";
import { IAttendanceRecordRepository } from "../../infrastructure/repositories/IAttendanceRecordRepository.js";

import { AttendanceRecordResponseMapper } from "../../infrastructure/mappers/AttendanceRecordResponseMapper.js";
import { AttendanceRecordResponseDto } from "../dto/AttendanceRecordResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/** The real "who's marked attendance in my session" view - faculty-facing, one real session, org-scoped. */
export class GetSessionAttendanceRecordsUseCase {

    constructor(

        private readonly sessionRepository: IAttendanceSessionRepository,

        private readonly recordRepository: IAttendanceRecordRepository

    ) {}

    async execute(

        sessionId: string,

        organizationId: string

    ): Promise<AttendanceRecordResponseDto[]> {

        const session =

            await this.sessionRepository.findById(
                sessionId
            );

        if (

            !session ||
            session.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Attendance session not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const records =

            await this.recordRepository.findBySession(
                sessionId
            );

        return records.map(

            record => AttendanceRecordResponseMapper.toDto(record)

        );

    }

}
