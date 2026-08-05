import { createCareerScoreProvider } from "../../../../../shared/infrastructure/ai/AIProviderFactory.js";

import {
    LeaderboardRepository,
} from "../../../../campus/leaderboard/infrastructure/repositories/LeaderboardRepository.js";

import {
    ResumeRepository,
} from "../../../../career/resume/infrastructure/repositories/ResumeRepository.js";

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";

import {
    AchievementRepository,
} from "../../../../career/achievements/infrastructure/repositories/AchievementRepository.js";

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

import { GetCareerScoreUseCase } from "../use-cases/GetCareerScoreUseCase.js";

const leaderboardRepository = new LeaderboardRepository();

const resumeRepository = new ResumeRepository();

const studentRepository = new StudentRepository();

const achievementRepository = new AchievementRepository();

const skillRepository = new SkillRepository();

const projectRepository = new PortfolioProjectRepository();

const experienceRepository = new ExperienceRepository();

const educationRepository = new EducationRepository();

const certificationRepository = new CertificationRepository();

/*
 Real Ollama-backed career score insight (see
 infrastructure/ai/OllamaCareerScoreProvider.ts). Every use case
 depends only on the ICareerScoreProvider port, so this is the only
 line that ever needed to change to go live.
*/
const careerScoreProvider = createCareerScoreProvider();

export const careerScoreContainer = {

    getCareerScore:

        new GetCareerScoreUseCase(

            careerScoreProvider,

            leaderboardRepository,

            resumeRepository,

            studentRepository,

            achievementRepository,

            skillRepository,

            projectRepository,

            experienceRepository,

            educationRepository,

            certificationRepository

        )

};
