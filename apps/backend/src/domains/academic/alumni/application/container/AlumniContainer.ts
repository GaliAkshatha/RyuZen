import { AlumniRepository } from "../../infrastructure/repositories/AlumniRepository.js";

import { UserRepository } from "../../../../identity/infrastructure/repositories/UserRepository.js";

import { BCryptPasswordHasher } from "../../../../identity/infrastructure/security/BCryptPasswordHasher.js";

import { CreateAlumniUseCase } from "../use-cases/CreateAlumniUseCase.js";
import { InviteAlumniUseCase } from "../use-cases/InviteAlumniUseCase.js";
import { GetAlumniUseCase } from "../use-cases/GetAlumniUseCase.js";
import { GetAlumniListUseCase } from "../use-cases/GetAlumniListUseCase.js";
import { UpdateAlumniUseCase } from "../use-cases/UpdateAlumniUseCase.js";
import { VerifyAlumniUseCase } from "../use-cases/VerifyAlumniUseCase.js";

const alumniRepository = new AlumniRepository();

const userRepository = new UserRepository();

const passwordHasher = new BCryptPasswordHasher();

export const alumniContainer = {

    createAlumni:

        new CreateAlumniUseCase(

            alumniRepository,

            userRepository

        ),

    inviteAlumni:

        new InviteAlumniUseCase(

            alumniRepository,

            passwordHasher

        ),

    getAlumni:

        new GetAlumniUseCase(
            alumniRepository
        ),

    getAlumniList:

        new GetAlumniListUseCase(
            alumniRepository
        ),

    updateAlumni:

        new UpdateAlumniUseCase(
            alumniRepository
        ),

    verifyAlumni:

        new VerifyAlumniUseCase(
            alumniRepository
        )

};
