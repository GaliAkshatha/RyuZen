import { ResumeTemplate } from "../../domain/entities/ResumeTemplate.js";

import { IResumeTemplateRepository } from "../../infrastructure/repositories/IResumeTemplateRepository.js";

import { ResumeTemplateResponseMapper } from "../../infrastructure/mappers/ResumeTemplateResponseMapper.js";

import { CreateResumeTemplateDto } from "../dto/CreateResumeTemplateDto.js";
import { ResumeTemplateResponseDto } from "../dto/ResumeTemplateResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class CreateResumeTemplateUseCase {

    constructor(

        private readonly repository: IResumeTemplateRepository

    ) {}

    async execute(

        dto: CreateResumeTemplateDto

    ): Promise<ResumeTemplateResponseDto> {

        const exists =

            await this.repository.existsByName(
                dto.name
            );

        if (exists) {

            throw new ApiError(

                "A resume template with this name already exists.",

                HttpStatus.CONFLICT

            );

        }

        const template = ResumeTemplate.create({

            name:
                dto.name,

            thumbnail:
                dto.thumbnail,

            templateFile:
                dto.templateFile,

            premium:
                dto.premium ?? false

        });

        const created =

            await this.repository.create(

                template

            );

        return ResumeTemplateResponseMapper.toDto(

            created

        );

    }

}
