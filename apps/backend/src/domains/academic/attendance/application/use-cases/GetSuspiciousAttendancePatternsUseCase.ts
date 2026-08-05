import { IAttendanceSessionRepository } from "../../infrastructure/repositories/IAttendanceSessionRepository.js";
import { IAttendanceRecordRepository } from "../../infrastructure/repositories/IAttendanceRecordRepository.js";

import { findSuspiciousAttendancePatterns } from "../../domain/services/findSuspiciousAttendancePatterns.js";

import { SuspiciousPatternResponseDto } from "../dto/SuspiciousPatternResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/** Default: 3+ distinct students marked from the same IP in one session is worth a human looking at - not so low that a shared lab/campus network floods faculty with false positives, not so high that real abuse (one phone marking a group) goes unflagged. */
const DEFAULT_THRESHOLD = 3;

/**
 * Faculty/admin-facing, real anomaly surfacing for one real session -
 * flags, never blocks (see findSuspiciousAttendancePatterns.ts for the
 * full reasoning). The organizationId check on the session is the
 * real access boundary here, not a role check alone.
 */
export class GetSuspiciousAttendancePatternsUseCase {

    constructor(

        private readonly sessionRepository: IAttendanceSessionRepository,

        private readonly recordRepository: IAttendanceRecordRepository

    ) {}

    async execute(

        sessionId: string,

        organizationId: string,

        threshold: number = DEFAULT_THRESHOLD

    ): Promise<SuspiciousPatternResponseDto[]> {

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

        return findSuspiciousAttendancePatterns(

            records,

            threshold

        );

    }

}
