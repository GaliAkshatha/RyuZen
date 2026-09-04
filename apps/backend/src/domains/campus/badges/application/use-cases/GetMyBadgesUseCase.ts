import { IBadgeRepository } from "../../infrastructure/repositories/IBadgeRepository.js";

import { IStudentBadgeRepository } from "../../infrastructure/repositories/IStudentBadgeRepository.js";

import { StudentBadgeResponseMapper } from "../../infrastructure/mappers/StudentBadgeResponseMapper.js";

import { StudentBadgeResponseDto } from "../dto/StudentBadgeResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Real gap this fills: GetStudentBadgesUseCase requires a Student
 * RECORD id, which a logged-in student has no way to know (their own
 * auth session only ever carries their real userId, not their
 * Student record's own id) - there was no way for a student to see
 * their own badges at all. Resolves the caller's real Student record
 * from their userId first, then reuses the exact same lookup logic.
 */
export class GetMyBadgesUseCase {

    constructor(

        private readonly badgeRepository: IBadgeRepository,

        private readonly studentBadgeRepository: IStudentBadgeRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        userId: string

    ): Promise<StudentBadgeResponseDto[]> {

        const student =

            await this.studentRepository.findByUserId(
                userId
            );

        if (!student) {

            throw new ApiError(

                "Student record not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const studentBadges =

            await this.studentBadgeRepository.findByStudent(
                student.id!
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
