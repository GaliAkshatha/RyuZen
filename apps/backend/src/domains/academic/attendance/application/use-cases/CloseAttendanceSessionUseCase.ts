import { IAttendanceSessionRepository } from "../../infrastructure/repositories/IAttendanceSessionRepository.js";

import { AttendanceSessionResponseMapper } from "../../infrastructure/mappers/AttendanceSessionResponseMapper.js";
import { AttendanceSessionResponseDto } from "../dto/AttendanceSessionResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class CloseAttendanceSessionUseCase {

    constructor(

        private readonly repository: IAttendanceSessionRepository

    ) {}

    async execute(

        sessionId: string,

        organizationId: string,

        facultyId: string

    ): Promise<AttendanceSessionResponseDto> {

        const session =

            await this.repository.findById(
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

        if (session.facultyId !== facultyId) {

            throw new ApiError(

                "Only the faculty member who opened this session can close it.",

                HttpStatus.FORBIDDEN

            );

        }

        session.close();

        const updated =

            await this.repository.save(
                session
            );

        return AttendanceSessionResponseMapper.toDto(

            updated

        );

    }

}
