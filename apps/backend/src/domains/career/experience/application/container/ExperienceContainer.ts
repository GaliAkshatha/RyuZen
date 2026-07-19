import { ExperienceRepository } from "../../infrastructure/repositories/ExperienceRepository.js";

import { CreateExperienceUseCase } from "../use-cases/CreateExperienceUseCase.js";
import { GetExperienceUseCase } from "../use-cases/GetExperienceUseCase.js";
import { GetExperiencesByUserUseCase } from "../use-cases/GetExperiencesByUserUseCase.js";
import { UpdateExperienceUseCase } from "../use-cases/UpdateExperienceUseCase.js";
import { DeleteExperienceUseCase } from "../use-cases/DeleteExperienceUseCase.js";

const experienceRepository = new ExperienceRepository();

export const experienceContainer = {

    createExperience:

        new CreateExperienceUseCase(
            experienceRepository
        ),

    getExperience:

        new GetExperienceUseCase(
            experienceRepository
        ),

    getExperiencesByUser:

        new GetExperiencesByUserUseCase(
            experienceRepository
        ),

    updateExperience:

        new UpdateExperienceUseCase(
            experienceRepository
        ),

    deleteExperience:

        new DeleteExperienceUseCase(
            experienceRepository
        )

};
