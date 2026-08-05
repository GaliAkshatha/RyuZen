import { randomBytes } from "node:crypto";

import { AttendanceSession } from "../../domain/entities/AttendanceSession.js";
import { AttendanceSessionStatus } from "../../domain/constants/AttendanceSessionStatus.js";

import { IAttendanceSessionRepository } from "../../infrastructure/repositories/IAttendanceSessionRepository.js";

import { AttendanceSessionResponseMapper } from "../../infrastructure/mappers/AttendanceSessionResponseMapper.js";

import { OpenAttendanceSessionDto } from "../dto/OpenAttendanceSessionDto.js";
import { AttendanceSessionResponseDto } from "../dto/AttendanceSessionResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * A real, unique 256-bit secret is generated per session - never
 * derived from anything guessable, never reused across sessions.
 * Sensible, stated defaults where the spec doesn't mandate a specific
 * number: 20-second QR rotation, 15-minute attendance window - both
 * genuinely configurable per session via the DTO, not hardcoded
 * globally.
 */
export class OpenAttendanceSessionUseCase {

    constructor(

        private readonly repository: IAttendanceSessionRepository

    ) {}

    async execute(

        organizationId: string,

        facultyId: string,

        dto: OpenAttendanceSessionDto

    ): Promise<AttendanceSessionResponseDto> {

        if (dto.requireLocation && (dto.latitude === undefined || dto.longitude === undefined)) {

            throw new ApiError(

                "A session requiring location must specify latitude and longitude.",

                HttpStatus.BAD_REQUEST

            );

        }

        const session = AttendanceSession.create({

            organizationId,

            facultyId,

            subject:
                dto.subject,

            departmentId:
                dto.departmentId,

            qrSecret:
                randomBytes(32).toString("hex"),

            qrRotationSeconds:
                dto.qrRotationSeconds ?? 20,

            windowMinutes:
                dto.windowMinutes ?? 15,

            requireLocation:
                dto.requireLocation ?? false,

            latitude:
                dto.latitude,

            longitude:
                dto.longitude,

            radiusMeters:
                dto.radiusMeters ?? 100,

            status:
                AttendanceSessionStatus.OPEN,

            openedAt:
                new Date()

        });

        const created =

            await this.repository.create(
                session
            );

        return AttendanceSessionResponseMapper.toDto(

            created

        );

    }

}
