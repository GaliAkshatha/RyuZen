import { StubResumeReviewProvider } from "../../infrastructure/ai/StubResumeReviewProvider.js";

import {
    ResumeRepository,
} from "../../../../career/resume/infrastructure/repositories/ResumeRepository.js";

import {
    SkillRepository,
} from "../../../../career/skills/infrastructure/repositories/SkillRepository.js";

import {
    PortfolioProjectRepository,
} from "../../../../career/portfolio/infrastructure/repositories/PortfolioProjectRepository.js";

import {
    ExperienceRepository,
} from "../../../../career/experience/infrastructure/repositories/ExperienceRepository.js";

import {
    EducationRepository,
} from "../../../../career/education/infrastructure/repositories/EducationRepository.js";

import {
    CertificationRepository,
} from "../../../../career/certifications/infrastructure/repositories/CertificationRepository.js";

import { ReviewResumeUseCase } from "../use-cases/ReviewResumeUseCase.js";

const resumeRepository = new ResumeRepository();

const skillRepository = new SkillRepository();

const projectRepository = new PortfolioProjectRepository();

const experienceRepository = new ExperienceRepository();

const educationRepository = new EducationRepository();

const certificationRepository = new CertificationRepository();

/*
 StubResumeReviewProvider is a placeholder (see
 infrastructure/ai/StubResumeReviewProvider.ts). Swap this single
 binding for a real IResumeReviewProvider implementation to go
 live; no other file in this module needs to change.
*/
const resumeReviewProvider = new StubResumeReviewProvider();

export const resumeReviewContainer = {

    reviewResume:

        new ReviewResumeUseCase(

            resumeReviewProvider,

            resumeRepository,

            skillRepository,

            projectRepository,

            experienceRepository,

            educationRepository,

            certificationRepository

        )

};
