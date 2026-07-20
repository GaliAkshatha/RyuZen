import { ResumeTemplate } from "../../domain/entities/ResumeTemplate.js";

import { IResumeTemplateRepository } from "../../infrastructure/repositories/IResumeTemplateRepository.js";

import { ResumeTemplateResponseMapper } from "../../infrastructure/mappers/ResumeTemplateResponseMapper.js";

import { CreateResumeTemplateDto } from "../dto/CreateResumeTemplateDto.js";
import { ResumeTemplateResponseDto } from "../dto/ResumeTemplateResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { ICacheService } from "../../../../../shared/core/cache/ICacheService.js";

import { RESUME_TEMPLATES_CACHE_KEY } from "./GetResumeTemplatesUseCase.js";

export class CreateResumeTemplateUseCase {

    constructor(

        private readonly repository: IResumeTemplateRepository,

        private readonly cacheService: ICacheService

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

        await this.cacheService.delete(

            RESUME_TEMPLATES_CACHE_KEY

        );

        return ResumeTemplateResponseMapper.toDto(

            created

        );

    }

}
