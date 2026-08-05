import { SkillRepository } from "../../infrastructure/repositories/SkillRepository.js";

import {
    UserRepository,
} from "../../../../identity/infrastructure/repositories/UserRepository.js";

import {
    PortfolioProjectRepository,
} from "../../../portfolio/infrastructure/repositories/PortfolioProjectRepository.js";

import {
    CertificationRepository,
} from "../../../certifications/infrastructure/repositories/CertificationRepository.js";

import {
    ExperienceRepository,
} from "../../../experience/infrastructure/repositories/ExperienceRepository.js";

import {
    SubmissionRepository,
} from "../../../../academic/submissions/infrastructure/repositories/SubmissionRepository.js";

import {
    ActivityRepository,
} from "../../../../academic/activities/infrastructure/repositories/ActivityRepository.js";

import { CreateSkillUseCase } from "../use-cases/CreateSkillUseCase.js";
import { GetSkillUseCase } from "../use-cases/GetSkillUseCase.js";
import { GetSkillsByUserUseCase } from "../use-cases/GetSkillsByUserUseCase.js";
import { UpdateSkillUseCase } from "../use-cases/UpdateSkillUseCase.js";
import { DeleteSkillUseCase } from "../use-cases/DeleteSkillUseCase.js";
import { VerifySkillUseCase } from "../use-cases/VerifySkillUseCase.js";
import { ExtractSkillsUseCase } from "../use-cases/ExtractSkillsUseCase.js";
import { ApproveSkillSuggestionUseCase } from "../use-cases/ApproveSkillSuggestionUseCase.js";
import { GetPendingSkillSuggestionsUseCase } from "../use-cases/GetPendingSkillSuggestionsUseCase.js";

import { createSkillExtractionProvider } from "../../../../../shared/infrastructure/ai/AIProviderFactory.js";

import {
    notificationContainer,
} from "../../../../communication/notifications/application/container/NotificationContainer.js";

const skillRepository = new SkillRepository();

const userRepository = new UserRepository();

const projectRepository = new PortfolioProjectRepository();

const certificationRepository = new CertificationRepository();

const experienceRepository = new ExperienceRepository();

const submissionRepository = new SubmissionRepository();

const activityRepository = new ActivityRepository();

/*
 Real Ollama-backed skill extraction (see
 infrastructure/ai/OllamaSkillExtractionProvider.ts). Every use case
 depends only on the ISkillExtractionProvider port, so this is the
 only line that would ever need to change.
*/
const skillExtractionProvider = createSkillExtractionProvider();

export const skillContainer = {

    createSkill:

        new CreateSkillUseCase(
            skillRepository
        ),

    getSkill:

        new GetSkillUseCase(
            skillRepository
        ),

    getSkillsByUser:

        new GetSkillsByUserUseCase(
            skillRepository
        ),

    updateSkill:

        new UpdateSkillUseCase(
            skillRepository
        ),

    deleteSkill:

        new DeleteSkillUseCase(
            skillRepository
        ),

    verifySkill:

        new VerifySkillUseCase(

            skillRepository,

            userRepository

        ),

    extractSkills:

        new ExtractSkillsUseCase(

            skillRepository,

            skillExtractionProvider,

            projectRepository,

            certificationRepository,

            experienceRepository,

            submissionRepository,

            activityRepository,

            notificationContainer.recordSystemNotification

        ),

    approveSkillSuggestion:

        new ApproveSkillSuggestionUseCase(
            skillRepository
        ),

    getPendingSkillSuggestions:

        new GetPendingSkillSuggestionsUseCase(
            skillRepository
        )

};
