import { IAttendanceRecordRepository } from "../../infrastructure/repositories/IAttendanceRecordRepository.js";

import { AttendanceRecordResponseMapper } from "../../infrastructure/mappers/AttendanceRecordResponseMapper.js";
import { AttendanceRecordResponseDto } from "../dto/AttendanceRecordResponseDto.js";

import {
    IStudentRepository,
} from "../../../students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/** A student's own real attendance history - resolved from their own real profile, never a studentId parameter a caller could substitute. */
export class GetMyAttendanceRecordsUseCase {

    constructor(

        private readonly recordRepository: IAttendanceRecordRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        requestingUserId: string

    ): Promise<AttendanceRecordResponseDto[]> {

        const student =

            await this.studentRepository.findByUserId(
                requestingUserId
            );

        if (!student) {

            throw new ApiError(

                "No student profile found for this account.",

                HttpStatus.FORBIDDEN

            );

        }

        const records =

            await this.recordRepository.findByStudent(
                student.id!
            );

        return records.map(

            record => AttendanceRecordResponseMapper.toDto(record)

        );

    }

}
