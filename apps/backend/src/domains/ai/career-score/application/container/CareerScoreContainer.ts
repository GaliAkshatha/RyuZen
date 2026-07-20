import { StubCareerScoreProvider } from "../../infrastructure/ai/StubCareerScoreProvider.js";

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
 StubCareerScoreProvider is a placeholder (see
 infrastructure/ai/StubCareerScoreProvider.ts). Swap this single
 binding for a real ICareerScoreProvider implementation to go
 live; no other file in this module needs to change.
*/
const careerScoreProvider = new StubCareerScoreProvider();

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
