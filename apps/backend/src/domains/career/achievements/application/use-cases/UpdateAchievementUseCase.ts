import { IAchievementRepository } from "../../infrastructure/repositories/IAchievementRepository.js";

import { AchievementResponseMapper } from "../../infrastructure/mappers/AchievementResponseMapper.js";

import { AchievementStatus } from "../../domain/constants/AchievementStatus.js";

import { UpdateAchievementDto } from "../dto/UpdateAchievementDto.js";
import { AchievementResponseDto } from "../dto/AchievementResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class UpdateAchievementUseCase {

    constructor(

        private readonly repository: IAchievementRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        id: string,

        userId: string,

        dto: UpdateAchievementDto

    ): Promise<AchievementResponseDto> {

        const achievement =

            await this.repository.findById(
                id
            );

        if (!achievement) {

            throw new ApiError(

                "Achievement not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const student =

            await this.studentRepository.findByUserId(
                userId
            );

        if (

            !student ||
            student.id !== achievement.studentId

        ) {

            throw new ApiError(

                "You can only update your own achievements.",

                HttpStatus.FORBIDDEN

            );

        }

        if (achievement.status !== AchievementStatus.PENDING) {

            throw new ApiError(

                "Only pending achievements can be updated.",

                HttpStatus.BAD_REQUEST

            );

        }

        achievement.updateDetails(dto);

        const updated =

            await this.repository.save(
                achievement
            );

        return AchievementResponseMapper.toDto(

            updated

        );

    }

}
