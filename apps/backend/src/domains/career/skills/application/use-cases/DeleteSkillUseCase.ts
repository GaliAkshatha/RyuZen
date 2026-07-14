import { ISkillRepository } from "../../infrastructure/repositories/ISkillRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class DeleteSkillUseCase {

    constructor(

        private readonly repository: ISkillRepository

    ) {}

    async execute(

        id: string,

        userId: string

    ): Promise<void> {

        const skill =

            await this.repository.findById(
                id
            );

        if (!skill) {

            throw new ApiError(

                "Skill not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (skill.userId !== userId) {

            throw new ApiError(

                "You can only delete your own skills.",

                HttpStatus.FORBIDDEN

            );

        }

        await this.repository.delete(

            id

        );

    }

}
