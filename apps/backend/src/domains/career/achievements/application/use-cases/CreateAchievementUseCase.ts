import { Achievement } from "../../domain/entities/Achievement.js";

import { AchievementStatus } from "../../domain/constants/AchievementStatus.js";

import { IAchievementRepository } from "../../infrastructure/repositories/IAchievementRepository.js";

import { AchievementResponseMapper } from "../../infrastructure/mappers/AchievementResponseMapper.js";

import { CreateAchievementDto } from "../dto/CreateAchievementDto.js";
import { AchievementResponseDto } from "../dto/AchievementResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class CreateAchievementUseCase {

    constructor(

        private readonly repository: IAchievementRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        dto: CreateAchievementDto,

        organizationId: string,

        userId: string

    ): Promise<AchievementResponseDto> {

        const student =

            await this.studentRepository.findByUserId(
                userId
            );

        if (!student) {

            throw new ApiError(

                "Only students can submit achievements.",

                HttpStatus.FORBIDDEN

            );

        }

        const achievement = Achievement.create({

            organizationId,

            studentId:
                student.id!,

            facultyId:
                student.mentorId,

            title:
                dto.title,

            description:
                dto.description,

            category:
                dto.category,

            level:
                dto.level,

            position:
                dto.position,

            certificateUrl:
                dto.certificateUrl,

            proofUrl:
                dto.proofUrl,

            achievementDate:
                dto.achievementDate,

            status:
                AchievementStatus.PENDING

        });

        const created =

            await this.repository.create(

                achievement

            );

        return AchievementResponseMapper.toDto(

            created

        );

    }

}
