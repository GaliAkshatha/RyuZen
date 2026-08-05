import { AttendanceRecord } from "../../domain/entities/AttendanceRecord.js";
import { AttendanceRecordStatus } from "../../domain/constants/AttendanceRecordStatus.js";
import { AttendanceMethod } from "../../domain/constants/AttendanceMethod.js";

import { IAttendanceSessionRepository } from "../../infrastructure/repositories/IAttendanceSessionRepository.js";
import { IAttendanceRecordRepository } from "../../infrastructure/repositories/IAttendanceRecordRepository.js";

import { AttendanceRecordResponseMapper } from "../../infrastructure/mappers/AttendanceRecordResponseMapper.js";

import { RequestAttendanceCorrectionDto } from "../dto/RequestAttendanceCorrectionDto.js";
import { AttendanceRecordResponseDto } from "../dto/AttendanceRecordResponseDto.js";

import {
    IStudentRepository,
} from "../../../students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * "Attendance correction requests, medical leave, approved absence
 * workflows" - one real mechanism covers all three (the reviewer
 * decides the resulting status: PRESENT/LATE for a genuine correction,
 * EXCUSED for a genuine approved absence). Wraps AttendanceRecord's
 * already-existing, already-correct requestCorrection() - this use
 * case only adds the missing piece: resolving the real record (or
 * creating one, honestly as ABSENT, if the student was never marked
 * at all for this session - the real, factual starting point before
 * any correction is reviewed).
 */
export class RequestAttendanceCorrectionUseCase {

    constructor(

        private readonly sessionRepository: IAttendanceSessionRepository,

        private readonly recordRepository: IAttendanceRecordRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        organizationId: string,

        requestingUserId: string,

        dto: RequestAttendanceCorrectionDto

    ): Promise<AttendanceRecordResponseDto> {

        const session =

            await this.sessionRepository.findById(
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

        const student =

            await this.studentRepository.findByUserId(
                requestingUserId
            );

        if (!student) {

            throw new ApiError(

                "Only a student can request an attendance correction.",

                HttpStatus.FORBIDDEN

            );

        }

        let record =

            await this.recordRepository.findBySessionAndStudent(
                dto.sessionId,
                student.id!
            );

        if (!record) {

            const created = AttendanceRecord.create({

                organizationId,

                sessionId: dto.sessionId,

                studentId: student.id!,

                method: AttendanceMethod.MANUAL,

                status: AttendanceRecordStatus.ABSENT,

                markedAt: new Date()

            });

            record =

                await this.recordRepository.create(
                    created
                );

        }

        record.requestCorrection(
            dto.reason
        );

        const updated =

            await this.recordRepository.save(
                record
            );

        return AttendanceRecordResponseMapper.toDto(

            updated

        );

    }

}
