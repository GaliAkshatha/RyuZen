import { EducationRepository } from "../../infrastructure/repositories/EducationRepository.js";

import { CreateEducationUseCase } from "../use-cases/CreateEducationUseCase.js";
import { GetEducationUseCase } from "../use-cases/GetEducationUseCase.js";
import { GetEducationByUserUseCase } from "../use-cases/GetEducationByUserUseCase.js";
import { UpdateEducationUseCase } from "../use-cases/UpdateEducationUseCase.js";
import { DeleteEducationUseCase } from "../use-cases/DeleteEducationUseCase.js";

const educationRepository = new EducationRepository();

export const educationContainer = {

    createEducation:

        new CreateEducationUseCase(
            educationRepository
        ),

    getEducation:

        new GetEducationUseCase(
            educationRepository
        ),

    getEducationByUser:

        new GetEducationByUserUseCase(
            educationRepository
        ),

    updateEducation:

        new UpdateEducationUseCase(
            educationRepository
        ),

    deleteEducation:

        new DeleteEducationUseCase(
            educationRepository
        )

};
