import { IAchievementRepository } from "../../infrastructure/repositories/IAchievementRepository.js";

import { AchievementResponseMapper } from "../../infrastructure/mappers/AchievementResponseMapper.js";

import { AchievementResponseDto } from "../dto/AchievementResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetMyAchievementsUseCase {

    constructor(

        private readonly repository: IAchievementRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        userId: string

    ): Promise<AchievementResponseDto[]> {

        const student =

            await this.studentRepository.findByUserId(
                userId
            );

        if (!student) {

            throw new ApiError(

                "No student profile is linked to your account yet. Contact your administrator.",

                HttpStatus.FORBIDDEN

            );

        }

        const achievements =

            await this.repository.findByStudent(

                student.id!,

                {}

            );

        return achievements.map(

            achievement =>

                AchievementResponseMapper.toDto(
                    achievement
                )

        );

    }

}
