import { IResumeTemplateRepository } from "../../infrastructure/repositories/IResumeTemplateRepository.js";

import { ResumeTemplateResponseMapper } from "../../infrastructure/mappers/ResumeTemplateResponseMapper.js";

import { ResumeTemplateResponseDto } from "../dto/ResumeTemplateResponseDto.js";

import { ICacheService } from "../../../../../shared/core/cache/ICacheService.js";

export const RESUME_TEMPLATES_CACHE_KEY = "resume-templates:catalog";

const RESUME_TEMPLATES_CACHE_TTL_SECONDS = 300;

export class GetResumeTemplatesUseCase {

    constructor(

        private readonly repository: IResumeTemplateRepository,

        private readonly cacheService: ICacheService

    ) {}

    async execute(): Promise<ResumeTemplateResponseDto[]> {

        const cached =

            await this.cacheService.get<ResumeTemplateResponseDto[]>(
                RESUME_TEMPLATES_CACHE_KEY
            );

        if (cached) {

            return cached;

        }

        const templates =

            await this.repository.findAll();

        const dtos =

            templates.map(

                template =>

                    ResumeTemplateResponseMapper.toDto(
                        template
                    )

            );

        await this.cacheService.set(

            RESUME_TEMPLATES_CACHE_KEY,

            dtos,

            RESUME_TEMPLATES_CACHE_TTL_SECONDS

        );

        return dtos;

    }

}
