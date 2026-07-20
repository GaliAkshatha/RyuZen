import { ResumeTemplate } from "../../domain/entities/ResumeTemplate.js";

import { ResumeTemplateResponseDto } from "../../application/dto/ResumeTemplateResponseDto.js";

export class ResumeTemplateResponseMapper {

    static toDto(

        template: ResumeTemplate

    ): ResumeTemplateResponseDto {

        return {

            id:
                template.id!,

            name:
                template.name,

            thumbnail:
                template.thumbnail,

            templateFile:
                template.templateFile,

            premium:
                template.premium,

            createdAt:
                template.createdAt

        };

    }

}
