import { IEducationRepository } from "../../infrastructure/repositories/IEducationRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class DeleteEducationUseCase {

    constructor(

        private readonly repository: IEducationRepository

    ) {}

    async execute(

        id: string,

        userId: string

    ): Promise<void> {

        const education =

            await this.repository.findById(
                id
            );

        if (!education) {

            throw new ApiError(

                "Education not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (education.userId !== userId) {

            throw new ApiError(

                "You can only delete your own education entries.",

                HttpStatus.FORBIDDEN

            );

        }

        await this.repository.delete(

            id

        );

    }

}
