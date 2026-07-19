import { IPortfolioProjectRepository } from "../../infrastructure/repositories/IPortfolioProjectRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class DeletePortfolioProjectUseCase {

    constructor(

        private readonly repository: IPortfolioProjectRepository

    ) {}

    async execute(

        id: string,

        userId: string

    ): Promise<void> {

        const project =

            await this.repository.findById(
                id
            );

        if (!project) {

            throw new ApiError(

                "Portfolio project not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (project.userId !== userId) {

            throw new ApiError(

                "You can only delete your own portfolio projects.",

                HttpStatus.FORBIDDEN

            );

        }

        await this.repository.delete(

            id

        );

    }

}
