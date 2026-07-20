import { Resume } from "../../domain/entities/Resume.js";

import { ResumeResponseDto } from "../../application/dto/ResumeResponseDto.js";

export class ResumeResponseMapper {

    static toDto(

        resume: Resume

    ): ResumeResponseDto {

        return {

            userId:
                resume.userId,

            selectedTemplate:
                resume.selectedTemplate,

            resumeUrl:
                resume.resumeUrl,

            lastGeneratedAt:
                resume.lastGeneratedAt,

            atsScore:
                resume.atsScore,

            visibility:
                resume.visibility,

            createdAt:
                resume.createdAt,

            updatedAt:
                resume.updatedAt

        };

    }

}
