import { SkillRepository } from "../../infrastructure/repositories/SkillRepository.js";

import {
    UserRepository,
} from "../../../../identity/infrastructure/repositories/UserRepository.js";

import { CreateSkillUseCase } from "../use-cases/CreateSkillUseCase.js";
import { GetSkillUseCase } from "../use-cases/GetSkillUseCase.js";
import { GetSkillsByUserUseCase } from "../use-cases/GetSkillsByUserUseCase.js";
import { UpdateSkillUseCase } from "../use-cases/UpdateSkillUseCase.js";
import { DeleteSkillUseCase } from "../use-cases/DeleteSkillUseCase.js";
import { VerifySkillUseCase } from "../use-cases/VerifySkillUseCase.js";

const skillRepository = new SkillRepository();

const userRepository = new UserRepository();

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

        )

};
