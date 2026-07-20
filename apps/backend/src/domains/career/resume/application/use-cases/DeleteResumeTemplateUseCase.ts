import { IResumeTemplateRepository } from "../../infrastructure/repositories/IResumeTemplateRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class DeleteResumeTemplateUseCase {

    constructor(

        private readonly repository: IResumeTemplateRepository

    ) {}

    async execute(

        id: string

    ): Promise<void> {

        const template =

            await this.repository.findById(
                id
            );

        if (!template) {

            throw new ApiError(

                "Resume template not found.",

                HttpStatus.NOT_FOUND

            );

        }

        await this.repository.delete(

            id

        );

    }

}
