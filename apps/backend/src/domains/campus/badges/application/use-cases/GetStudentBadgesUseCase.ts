import { IBadgeRepository } from "../../infrastructure/repositories/IBadgeRepository.js";

import { IStudentBadgeRepository } from "../../infrastructure/repositories/IStudentBadgeRepository.js";

import { StudentBadgeResponseMapper } from "../../infrastructure/mappers/StudentBadgeResponseMapper.js";

import { StudentBadgeResponseDto } from "../dto/StudentBadgeResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetStudentBadgesUseCase {

    constructor(

        private readonly badgeRepository: IBadgeRepository,

        private readonly studentBadgeRepository: IStudentBadgeRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        studentId: string,

        organizationId: string

    ): Promise<StudentBadgeResponseDto[]> {

        const student =

            await this.studentRepository.findById(
                studentId
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

        const studentBadges =

            await this.studentBadgeRepository.findByStudent(
                studentId
            );

        const results: StudentBadgeResponseDto[] = [];

        for (const studentBadge of studentBadges) {

            const badge =

                await this.badgeRepository.findById(
                    studentBadge.badgeId
                );

            results.push(

                StudentBadgeResponseMapper.toDto(

                    studentBadge,

                    badge ?? undefined

                )

            );

        }

        return results;

    }

}
