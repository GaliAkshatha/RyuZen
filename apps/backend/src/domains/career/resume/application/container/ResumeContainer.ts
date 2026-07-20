import { ResumeRepository } from "../../infrastructure/repositories/ResumeRepository.js";

import { ResumeTemplateRepository } from "../../infrastructure/repositories/ResumeTemplateRepository.js";

import {
    SkillRepository,
} from "../../../skills/infrastructure/repositories/SkillRepository.js";

import {
    PortfolioProjectRepository,
} from "../../../portfolio/infrastructure/repositories/PortfolioProjectRepository.js";

import {
    ExperienceRepository,
} from "../../../experience/infrastructure/repositories/ExperienceRepository.js";

import {
    EducationRepository,
} from "../../../education/infrastructure/repositories/EducationRepository.js";

import {
    CertificationRepository,
} from "../../../certifications/infrastructure/repositories/CertificationRepository.js";

import { CreateResumeTemplateUseCase } from "../use-cases/CreateResumeTemplateUseCase.js";
import { GetResumeTemplateUseCase } from "../use-cases/GetResumeTemplateUseCase.js";
import { GetResumeTemplatesUseCase } from "../use-cases/GetResumeTemplatesUseCase.js";
import { UpdateResumeTemplateUseCase } from "../use-cases/UpdateResumeTemplateUseCase.js";
import { DeleteResumeTemplateUseCase } from "../use-cases/DeleteResumeTemplateUseCase.js";
import { GenerateResumeUseCase } from "../use-cases/GenerateResumeUseCase.js";
import { GetMyResumeUseCase } from "../use-cases/GetMyResumeUseCase.js";
import { DownloadResumeUseCase } from "../use-cases/DownloadResumeUseCase.js";
import { UpdateResumeVisibilityUseCase } from "../use-cases/UpdateResumeVisibilityUseCase.js";

import { cacheService } from "../../../../../shared/infrastructure/cache/InMemoryCacheService.js";

const resumeRepository = new ResumeRepository();

const resumeTemplateRepository = new ResumeTemplateRepository();

const skillRepository = new SkillRepository();

const projectRepository = new PortfolioProjectRepository();

const experienceRepository = new ExperienceRepository();

const educationRepository = new EducationRepository();

const certificationRepository = new CertificationRepository();

export const resumeContainer = {

    createResumeTemplate:

        new CreateResumeTemplateUseCase(

            resumeTemplateRepository,

            cacheService

        ),

    getResumeTemplate:

        new GetResumeTemplateUseCase(
            resumeTemplateRepository
        ),

    getResumeTemplates:

        new GetResumeTemplatesUseCase(

            resumeTemplateRepository,

            cacheService

        ),

    updateResumeTemplate:

        new UpdateResumeTemplateUseCase(

            resumeTemplateRepository,

            cacheService

        ),

    deleteResumeTemplate:

        new DeleteResumeTemplateUseCase(

            resumeTemplateRepository,

            cacheService

        ),

    generateResume:

        new GenerateResumeUseCase(

            resumeRepository,

            resumeTemplateRepository,

            skillRepository,

            projectRepository,

            experienceRepository,

            educationRepository,

            certificationRepository

        ),

    getMyResume:

        new GetMyResumeUseCase(
            resumeRepository
        ),

    downloadResume:

        new DownloadResumeUseCase(
            resumeRepository
        ),

    updateResumeVisibility:

        new UpdateResumeVisibilityUseCase(
            resumeRepository
        )

};
