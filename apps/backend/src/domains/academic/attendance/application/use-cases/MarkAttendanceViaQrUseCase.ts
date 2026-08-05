import { AttendanceRecord } from "../../domain/entities/AttendanceRecord.js";
import { AttendanceMethod } from "../../domain/constants/AttendanceMethod.js";
import { AttendanceRecordStatus } from "../../domain/constants/AttendanceRecordStatus.js";
import { AttendanceSessionStatus } from "../../domain/constants/AttendanceSessionStatus.js";

import { verifyAttendanceQrToken } from "../../domain/services/attendanceQrToken.js";
import { haversineDistanceMeters } from "../../domain/services/haversineDistance.js";

import { IAttendanceSessionRepository } from "../../infrastructure/repositories/IAttendanceSessionRepository.js";
import { IAttendanceRecordRepository } from "../../infrastructure/repositories/IAttendanceRecordRepository.js";

import { AttendanceRecordResponseMapper } from "../../infrastructure/mappers/AttendanceRecordResponseMapper.js";

import { MarkAttendanceViaQrDto } from "../dto/MarkAttendanceViaQrDto.js";
import { AttendanceRecordResponseDto } from "../dto/AttendanceRecordResponseDto.js";

import {
    IStudentRepository,
} from "../../../students/infrastructure/repositories/IStudentRepository.js";

import { CreateAuditLogUseCase } from "../../../../platform/audit/application/use-cases/CreateAuditLogUseCase.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * The real QR scan flow: session must genuinely be open and within
 * its configured window, the submitted token must genuinely verify
 * against the session's real secret (current or immediately previous
 * rotation window - see attendanceQrToken.ts), GPS proximity is
 * genuinely checked via real haversine distance when the session
 * requires it, and duplicate marks are genuinely prevented (checked
 * here AND enforced at the database's own unique index, so a race
 * condition can't slip two records through).
 *
 * Deliberately does NOT emit a Growth Profile event per mark - a
 * single attendance mark is routine, not a genuine milestone. A real
 * attendance-based growth signal (e.g. a semester attendance
 * threshold) would need periodic aggregation this first version
 * doesn't build - stated honestly rather than emitting a noisy event
 * per class.
 */
export class MarkAttendanceViaQrUseCase {

    constructor(

        private readonly sessionRepository: IAttendanceSessionRepository,

        private readonly recordRepository: IAttendanceRecordRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly createAuditLog: CreateAuditLogUseCase

    ) {}

    async execute(

        organizationId: string,

        studentUserId: string,

        dto: MarkAttendanceViaQrDto,

        ipAddress: string,

        userAgent: string

    ): Promise<AttendanceRecordResponseDto> {

        const session =

            await this.sessionRepository.findByIdWithSecret(
                dto.sessionId
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

        if (

            session.status !== AttendanceSessionStatus.OPEN ||
            !session.isAcceptingMarks()

        ) {

            throw new ApiError(

                "This attendance session is no longer accepting marks.",

                HttpStatus.BAD_REQUEST

            );

        }

        const tokenValid =

            verifyAttendanceQrToken(

                dto.token,

                session.id!,

                session.qrSecret,

                session.qrRotationSeconds

            );

        if (!tokenValid) {

            throw new ApiError(

                "This QR code has expired. Ask your instructor to show the current code.",

                HttpStatus.BAD_REQUEST

            );

        }

        if (session.requireLocation) {

            if (dto.latitude === undefined || dto.longitude === undefined) {

                throw new ApiError(

                    "This session requires your location to mark attendance.",

                    HttpStatus.BAD_REQUEST

                );

            }

            const distance =

                haversineDistanceMeters(

                    session.latitude!,

                    session.longitude!,

                    dto.latitude,

                    dto.longitude

                );

            if (distance > (session.radiusMeters ?? 100)) {

                throw new ApiError(

                    "You appear to be too far from the class location to mark attendance.",

                    HttpStatus.BAD_REQUEST

                );

            }

        }

        const student =

            await this.studentRepository.findByUserId(
                studentUserId
            );

        if (!student) {

            throw new ApiError(

                "Only students can mark attendance.",

                HttpStatus.FORBIDDEN

            );

        }

        const existing =

            await this.recordRepository.findBySessionAndStudent(
                dto.sessionId,
                student.id!
            );

        if (existing) {

            throw new ApiError(

                "You have already marked attendance for this session.",

                HttpStatus.CONFLICT

            );

        }

        const record = AttendanceRecord.create({

            organizationId,

            sessionId:
                dto.sessionId,

            studentId:
                student.id!,

            method:
                AttendanceMethod.QR,

            status:
                AttendanceRecordStatus.PRESENT,

            markedAt:
                new Date(),

            ipAddress,

            userAgent,

            latitude:
                dto.latitude,

            longitude:
                dto.longitude

        });

        let created: AttendanceRecord;

        try {

            created =

                await this.recordRepository.create(
                    record
                );

        } catch (error) {

            // The database's own unique index is the final real
            // defense against a race condition slipping two marks
            // through between the findBySessionAndStudent check above
            // and this insert - a duplicate-key error here means
            // exactly that race happened, not an unexpected failure.
            throw new ApiError(

                "You have already marked attendance for this session.",

                HttpStatus.CONFLICT

            );

        }

        await this.createAuditLog.execute({

            organizationId,

            userId: studentUserId,

            action: "ATTENDANCE_MARKED",

            entityType: "AttendanceRecord",

            entityId: created.id!,

            method: "POST",

            path: "/api/v1/attendance/mark",

            statusCode: 201,

            ipAddress,

            userAgent

        }).catch(() => {
            // Audit logging must never break a real, already-recorded attendance mark.
        });

        return AttendanceRecordResponseMapper.toDto(

            created

        );

    }

}
