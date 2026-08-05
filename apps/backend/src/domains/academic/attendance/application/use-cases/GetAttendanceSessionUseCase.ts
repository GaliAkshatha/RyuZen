import { IAttendanceSessionRepository } from "../../infrastructure/repositories/IAttendanceSessionRepository.js";

import { AttendanceSessionResponseMapper } from "../../infrastructure/mappers/AttendanceSessionResponseMapper.js";
import { AttendanceSessionResponseDto } from "../dto/AttendanceSessionResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/** A real, missing piece - without this, a faculty member returning to (or refreshing) a session's page has no way to re-fetch it after the initial creation response. */
export class GetAttendanceSessionUseCase {

    constructor(

        private readonly sessionRepository: IAttendanceSessionRepository

    ) {}

    async execute(

        sessionId: string,

        organizationId: string

    ): Promise<AttendanceSessionResponseDto> {

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

        return AttendanceSessionResponseMapper.toDto(

            session

        );

    }

}
