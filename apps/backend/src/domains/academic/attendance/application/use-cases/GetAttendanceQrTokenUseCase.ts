import { IAttendanceSessionRepository } from "../../infrastructure/repositories/IAttendanceSessionRepository.js";

import { generateAttendanceQrToken } from "../../domain/services/attendanceQrToken.js";

import { AttendanceSessionStatus } from "../../domain/constants/AttendanceSessionStatus.js";

import { AttendanceQrTokenResponseDto } from "../dto/AttendanceQrTokenResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Faculty-only - the real secret never leaves the server, only the
 * derived current-window token does. Called repeatedly by the faculty
 * device to redraw the QR image as it rotates - see
 * qrRotationSeconds on the session itself.
 */
export class GetAttendanceQrTokenUseCase {

    constructor(

        private readonly repository: IAttendanceSessionRepository

    ) {}

    async execute(

        sessionId: string,

        organizationId: string,

        facultyId: string

    ): Promise<AttendanceQrTokenResponseDto> {

        const session =

            await this.repository.findByIdWithSecret(
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

                "Only the faculty member who opened this session can view its QR token.",

                HttpStatus.FORBIDDEN

            );

        }

        if (session.status !== AttendanceSessionStatus.OPEN) {

            throw new ApiError(

                "This attendance session is closed.",

                HttpStatus.BAD_REQUEST

            );

        }

        const now = Date.now();

        const token =

            generateAttendanceQrToken(

                sessionId,

                session.qrSecret,

                session.qrRotationSeconds,

                now

            );

        const currentWindowStart =

            Math.floor(now / (session.qrRotationSeconds * 1000)) * session.qrRotationSeconds * 1000;

        const expiresInSeconds =

            Math.ceil((currentWindowStart + session.qrRotationSeconds * 1000 - now) / 1000);

        return {

            token,

            expiresInSeconds

        };

    }

}
