import { IExperienceRepository } from "../../infrastructure/repositories/IExperienceRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class DeleteExperienceUseCase {

    constructor(

        private readonly repository: IExperienceRepository

    ) {}

    async execute(

        id: string,

        userId: string

    ): Promise<void> {

        const experience =

            await this.repository.findById(
                id
            );

        if (!experience) {

            throw new ApiError(

                "Experience not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (experience.userId !== userId) {

            throw new ApiError(

                "You can only delete your own experience entries.",

                HttpStatus.FORBIDDEN

            );

        }

        await this.repository.delete(

            id

        );

    }

}
