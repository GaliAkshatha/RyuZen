import { IResumeTemplateRepository } from "../../infrastructure/repositories/IResumeTemplateRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { ICacheService } from "../../../../../shared/core/cache/ICacheService.js";

import { RESUME_TEMPLATES_CACHE_KEY } from "./GetResumeTemplatesUseCase.js";

export class DeleteResumeTemplateUseCase {

    constructor(

        private readonly repository: IResumeTemplateRepository,

        private readonly cacheService: ICacheService

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

        await this.cacheService.delete(

            RESUME_TEMPLATES_CACHE_KEY

        );

    }

}
