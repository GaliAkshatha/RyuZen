import { StudentBadge } from "../../domain/entities/StudentBadge.js";

import { IBadgeRepository } from "../../infrastructure/repositories/IBadgeRepository.js";

import { IStudentBadgeRepository } from "../../infrastructure/repositories/IStudentBadgeRepository.js";

import { StudentBadgeResponseMapper } from "../../infrastructure/mappers/StudentBadgeResponseMapper.js";

import { AwardBadgeDto } from "../dto/AwardBadgeDto.js";
import { StudentBadgeResponseDto } from "../dto/StudentBadgeResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class AwardBadgeUseCase {

    constructor(

        private readonly repository: IBadgeRepository,

        private readonly studentBadgeRepository: IStudentBadgeRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        badgeId: string,

        organizationId: string,

        awardedBy: string,

        dto: AwardBadgeDto

    ): Promise<StudentBadgeResponseDto> {

        const badge =

            await this.repository.findById(
                badgeId
            );

        if (!badge) {

            throw new ApiError(

                "Badge not found.",

                HttpStatus.NOT_FOUND

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

        const alreadyAwarded =

            await this.studentBadgeRepository.existsByStudentAndBadge(

                dto.studentId,

                badgeId

            );

        if (alreadyAwarded) {

            throw new ApiError(

                "This badge has already been awarded to this student.",

                HttpStatus.CONFLICT

            );

        }

        const studentBadge = StudentBadge.create({

            studentId:
                dto.studentId,

            badgeId,

            awardedBy,

            awardedAt:
                new Date()

        });

        const created =

            await this.studentBadgeRepository.create(

                studentBadge

            );

        return StudentBadgeResponseMapper.toDto(

            created,

            badge

        );

    }

}
