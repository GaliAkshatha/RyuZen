import { FacultyRepository } from "../../infrastructure/repositories/FacultyRepository.js";

import { UserRepository } from "../../../../identity/infrastructure/repositories/UserRepository.js";

import { DepartmentRepository } from "../../../departments/infrastructure/repositories/DepartmentRepository.js";

import { PasswordService } from "../../../../../shared/security/PasswordService.js";

import { CreateFacultyUseCase } from "../use-cases/CreateFacultyUseCase.js";

const facultyRepository =

    new FacultyRepository();

const userRepository =

    new UserRepository();

const departmentRepository =

    new DepartmentRepository();

export const facultyContainer = {

    createFaculty:

        new CreateFacultyUseCase(

            userRepository,

            facultyRepository,

            departmentRepository,

            PasswordService

        )

};