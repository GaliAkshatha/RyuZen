import { IAchievementRepository } from "../../infrastructure/repositories/IAchievementRepository.js";

import { AchievementStatus } from "../../domain/constants/AchievementStatus.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class DeleteAchievementUseCase {

    constructor(

        private readonly repository: IAchievementRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        id: string,

        userId: string

    ): Promise<void> {

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

                "You can only delete your own achievements.",

                HttpStatus.FORBIDDEN

            );

        }

        if (achievement.status !== AchievementStatus.PENDING) {

            throw new ApiError(

                "Only pending achievements can be deleted.",

                HttpStatus.BAD_REQUEST

            );

        }

        await this.repository.delete(

            id

        );

    }

}
