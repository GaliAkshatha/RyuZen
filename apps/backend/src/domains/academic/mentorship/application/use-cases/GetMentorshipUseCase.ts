import { IMentorshipRepository } from "../../infrastructure/repositories/IMentorshipRepository.js";

import {
    IStudentRepository,
} from "../../../students/infrastructure/repositories/IStudentRepository.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { MentorshipResponseMapper } from "../../infrastructure/mappers/MentorshipResponseMapper.js";

import { MentorshipResponseDto } from "../dto/MentorshipResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Real gap found while auditing Faculty's "My Students" flow:
 * GetMentorshipsUseCase (the list) was already enriched with the real
 * student name/usn, but this singular version - used by
 * MentorshipDetailPage when a faculty member clicks into one of their
 * mentees - was not. That page was calling the admin-only GET
 * /students directly as a fallback, which 403s for Faculty and
 * silently shows the raw studentId. Same enrichment, same reason,
 * applied here too.
 */
export class GetMentorshipUseCase {

    constructor(

        private readonly repository: IMentorshipRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<MentorshipResponseDto> {

        const mentorship =

            await this.repository.findById(
                id
            );

        if (

            !mentorship ||
            mentorship.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Mentorship not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const dto =

            MentorshipResponseMapper.toDto(
                mentorship
            );

        const student =

            await this.studentRepository.findById(
                dto.studentId
            );

        if (student) {

            dto.studentUsn = student.usn;

            const user =

                await this.userRepository.findById(
                    student.userId
                );

            if (user) {

                dto.studentName = user.name;

            }

        }

        return dto;

    }

}
