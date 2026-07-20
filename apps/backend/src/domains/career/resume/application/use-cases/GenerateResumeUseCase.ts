import { Resume } from "../../domain/entities/Resume.js";

import { ResumeVisibility } from "../../domain/constants/ResumeVisibility.js";

import { IResumeRepository } from "../../infrastructure/repositories/IResumeRepository.js";

import { IResumeTemplateRepository } from "../../infrastructure/repositories/IResumeTemplateRepository.js";

import { ResumeResponseMapper } from "../../infrastructure/mappers/ResumeResponseMapper.js";

import { GenerateResumeDto } from "../dto/GenerateResumeDto.js";
import { ResumeResponseDto } from "../dto/ResumeResponseDto.js";

import {
    ISkillRepository,
} from "../../../skills/infrastructure/repositories/ISkillRepository.js";

import {
    IPortfolioProjectRepository,
} from "../../../portfolio/infrastructure/repositories/IPortfolioProjectRepository.js";

import {
    IExperienceRepository,
} from "../../../experience/infrastructure/repositories/IExperienceRepository.js";

import {
    IEducationRepository,
} from "../../../education/infrastructure/repositories/IEducationRepository.js";

import {
    ICertificationRepository,
} from "../../../certifications/infrastructure/repositories/ICertificationRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GenerateResumeUseCase {

    constructor(

        private readonly repository: IResumeRepository,

        private readonly templateRepository: IResumeTemplateRepository,

        private readonly skillRepository: ISkillRepository,

        private readonly projectRepository: IPortfolioProjectRepository,

        private readonly experienceRepository: IExperienceRepository,

        private readonly educationRepository: IEducationRepository,

        private readonly certificationRepository: ICertificationRepository

    ) {}

    async execute(

        userId: string,

        dto: GenerateResumeDto

    ): Promise<ResumeResponseDto> {

        const template =

            await this.templateRepository.findById(
                dto.selectedTemplate
            );

        if (!template) {

            throw new ApiError(

                "Resume template not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const [

            skills,

            projects,

            experience,

            education,

            certifications

        ] = await Promise.all([

            this.skillRepository.findByUserId(
                userId
            ),

            this.projectRepository.findByUserId(
                userId
            ),

            this.experienceRepository.findByUserId(
                userId
            ),

            this.educationRepository.findByUserId(
                userId
            ),

            this.certificationRepository.findByUserId(
                userId
            )

        ]);

        const atsScore =

            Math.min(

                100,

                skills.length * 5 +
                projects.length * 10 +
                experience.length * 15 +
                education.length * 10 +
                certifications.length * 5

            );

        let resume =

            await this.repository.findByUserId(
                userId
            );

        if (!resume) {

            resume = Resume.create({

                userId,

                visibility:
                    ResumeVisibility.PRIVATE

            });

        }

        resume.generate({

            selectedTemplate:
                dto.selectedTemplate,

            resumeUrl:
                dto.resumeUrl,

            atsScore

        });

        const saved =

            await this.repository.upsert(

                resume

            );

        return ResumeResponseMapper.toDto(

            saved

        );

    }

}
