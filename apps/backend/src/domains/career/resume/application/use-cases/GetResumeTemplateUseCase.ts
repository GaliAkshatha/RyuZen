import { IResumeTemplateRepository } from "../../infrastructure/repositories/IResumeTemplateRepository.js";

import { ResumeTemplateResponseMapper } from "../../infrastructure/mappers/ResumeTemplateResponseMapper.js";

import { ResumeTemplateResponseDto } from "../dto/ResumeTemplateResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetResumeTemplateUseCase {

    constructor(

        private readonly repository: IResumeTemplateRepository

    ) {}

    async execute(

        id: string

    ): Promise<ResumeTemplateResponseDto> {

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

        return ResumeTemplateResponseMapper.toDto(

            template

        );

    }

}
