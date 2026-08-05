import { AlumniRepository } from "../../infrastructure/repositories/AlumniRepository.js";

import { UserRepository } from "../../../../identity/infrastructure/repositories/UserRepository.js";

import {
    StudentRepository,
} from "../../../students/infrastructure/repositories/StudentRepository.js";

import { BCryptPasswordHasher } from "../../../../identity/infrastructure/security/BCryptPasswordHasher.js";

import { CreateAlumniUseCase } from "../use-cases/CreateAlumniUseCase.js";
import { InviteAlumniUseCase } from "../use-cases/InviteAlumniUseCase.js";
import { GetAlumniUseCase } from "../use-cases/GetAlumniUseCase.js";
import { GetAlumniListUseCase } from "../use-cases/GetAlumniListUseCase.js";
import { UpdateAlumniUseCase } from "../use-cases/UpdateAlumniUseCase.js";
import { VerifyAlumniUseCase } from "../use-cases/VerifyAlumniUseCase.js";
import { ConvertStudentToAlumniUseCase } from "../use-cases/ConvertStudentToAlumniUseCase.js";

import { growthEventRecorder } from "../../../../../shared/infrastructure/growth/growthEventRecorder.js";
import { auditContainer } from "../../../../platform/audit/application/container/AuditContainer.js";

const alumniRepository = new AlumniRepository();

const userRepository = new UserRepository();

const studentRepository = new StudentRepository();

const passwordHasher = new BCryptPasswordHasher();

const createAlumniUseCase = new CreateAlumniUseCase(

    alumniRepository,

    userRepository

);

export const alumniContainer = {

    createAlumni:

        createAlumniUseCase,

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
        ),

    convertStudentToAlumni:

        new ConvertStudentToAlumniUseCase(

            studentRepository,

            userRepository,

            createAlumniUseCase,

            growthEventRecorder,

            auditContainer.createAuditLog

        )

};
