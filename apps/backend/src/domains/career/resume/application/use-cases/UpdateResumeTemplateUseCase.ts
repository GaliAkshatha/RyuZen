import { IResumeTemplateRepository } from "../../infrastructure/repositories/IResumeTemplateRepository.js";

import { ResumeTemplateResponseMapper } from "../../infrastructure/mappers/ResumeTemplateResponseMapper.js";

import { UpdateResumeTemplateDto } from "../dto/UpdateResumeTemplateDto.js";
import { ResumeTemplateResponseDto } from "../dto/ResumeTemplateResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class UpdateResumeTemplateUseCase {

    constructor(

        private readonly repository: IResumeTemplateRepository

    ) {}

    async execute(

        id: string,

        dto: UpdateResumeTemplateDto

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

        if (

            dto.name !== undefined &&
            dto.name !== template.name

        ) {

            const nameTaken =

                await this.repository.existsByName(
                    dto.name
                );

            if (nameTaken) {

                throw new ApiError(

                    "A resume template with this name already exists.",

                    HttpStatus.CONFLICT

                );

            }

        }

        template.updateDetails(dto);

        const updated =

            await this.repository.save(
                template
            );

        return ResumeTemplateResponseMapper.toDto(

            updated

        );

    }

}
