import { UserPortfolioRepository } from "../../infrastructure/repositories/UserPortfolioRepository.js";

import {
    UserRepository,
} from "../../../../identity/infrastructure/repositories/UserRepository.js";

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";

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

import {
    AchievementRepository,
} from "../../../achievements/infrastructure/repositories/AchievementRepository.js";

import { GetUserPortfolioUseCase } from "../use-cases/GetUserPortfolioUseCase.js";
import { UpdateUserPortfolioUseCase } from "../use-cases/UpdateUserPortfolioUseCase.js";

const userPortfolioRepository = new UserPortfolioRepository();

const userRepository = new UserRepository();

const studentRepository = new StudentRepository();

const skillRepository = new SkillRepository();

const projectRepository = new PortfolioProjectRepository();

const experienceRepository = new ExperienceRepository();

const educationRepository = new EducationRepository();

const certificationRepository = new CertificationRepository();

const achievementRepository = new AchievementRepository();

export const userPortfolioContainer = {

    getUserPortfolio:

        new GetUserPortfolioUseCase(

            userRepository,

            userPortfolioRepository,

            studentRepository,

            skillRepository,

            projectRepository,

            experienceRepository,

            educationRepository,

            certificationRepository,

            achievementRepository

        ),

    updateUserPortfolio:

        new UpdateUserPortfolioUseCase(

            userPortfolioRepository

        )

};
