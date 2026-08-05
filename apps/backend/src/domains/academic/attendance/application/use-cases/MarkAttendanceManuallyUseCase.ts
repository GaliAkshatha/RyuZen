import { AttendanceRecord } from "../../domain/entities/AttendanceRecord.js";
import { AttendanceMethod } from "../../domain/constants/AttendanceMethod.js";

import { IAttendanceSessionRepository } from "../../infrastructure/repositories/IAttendanceSessionRepository.js";
import { IAttendanceRecordRepository } from "../../infrastructure/repositories/IAttendanceRecordRepository.js";

import { AttendanceRecordResponseMapper } from "../../infrastructure/mappers/AttendanceRecordResponseMapper.js";

import { MarkAttendanceManuallyDto } from "../dto/MarkAttendanceManuallyDto.js";
import { AttendanceRecordResponseDto } from "../dto/AttendanceRecordResponseDto.js";

import {
    IStudentRepository,
} from "../../../students/infrastructure/repositories/IStudentRepository.js";

import { CreateAuditLogUseCase } from "../../../../platform/audit/application/use-cases/CreateAuditLogUseCase.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * "Manual attendance" and "faculty override" and "offline attendance
 * handling" - the same real mechanism serves all three: only the
 * faculty member who opened the session can use it (never another
 * faculty member marking someone else's class), bypasses QR/GPS
 * entirely since it's a deliberate override, and real duplicate
 * prevention still applies - overriding an existing mark means
 * updating it, not creating a second record (see the existing-record
 * branch below), keeping exactly one real record per (session,
 * student) the same as the QR path.
 */
export class MarkAttendanceManuallyUseCase {

    constructor(

        private readonly sessionRepository: IAttendanceSessionRepository,

        private readonly recordRepository: IAttendanceRecordRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly createAuditLog: CreateAuditLogUseCase

    ) {}

    async execute(

        sessionId: string,

        organizationId: string,

        facultyId: string,

        dto: MarkAttendanceManuallyDto

    ): Promise<AttendanceRecordResponseDto> {

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

        if (session.facultyId !== facultyId) {

            throw new ApiError(

                "Only the faculty member who opened this session can mark attendance manually.",

                HttpStatus.FORBIDDEN

            );

        }

        const student =

            await this.studentRepository.findById(
                dto.studentId
            );

        if (

            !student ||
            student.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Student not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const existing =

            await this.recordRepository.findBySessionAndStudent(
                sessionId,
                dto.studentId
            );

        let saved: AttendanceRecord;

        if (existing) {

            const updated = AttendanceRecord.create({

                ...existing.toObject(),

                status: dto.status,

                method: dto.method,

                markedBy: facultyId

            });

            saved =

                await this.recordRepository.save(
                    updated
                );

        } else {

            const record = AttendanceRecord.create({

                organizationId,

                sessionId,

                studentId:
                    dto.studentId,

                method:
                    dto.method,

                status:
                    dto.status,

                markedAt:
                    new Date(),

                markedBy:
                    facultyId

            });

            saved =

                await this.recordRepository.create(
                    record
                );

        }

        await this.createAuditLog.execute({

            organizationId,

            userId: facultyId,

            action: dto.method === AttendanceMethod.OFFLINE ? "ATTENDANCE_MARKED_OFFLINE" : "ATTENDANCE_OVERRIDDEN",

            entityType: "AttendanceRecord",

            entityId: saved.id!,

            method: "PATCH",

            path: `/api/v1/attendance/sessions/${sessionId}/mark-manual`,

            statusCode: 200

        }).catch(() => {
            // Audit logging must never break a real, already-recorded attendance mark.
        });

        return AttendanceRecordResponseMapper.toDto(

            saved

        );

    }

}
