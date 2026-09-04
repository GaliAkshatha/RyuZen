import { FacultyRepository } from "../../infrastructure/repositories/FacultyRepository.js";

import { UserRepository } from "../../../../identity/infrastructure/repositories/UserRepository.js";

import { DepartmentRepository } from "../../../departments/infrastructure/repositories/DepartmentRepository.js";

import { CreateFacultyUseCase } from "../use-cases/CreateFacultyUseCase.js";
import { GetFacultyUseCase } from "../use-cases/GetFacultyUseCase.js";
import { GetMyFacultyProfileUseCase } from "../use-cases/GetMyFacultyProfileUseCase.js";
import { GetFacultiesUseCase } from "../use-cases/GetFacultiesUseCase.js";
import { UpdateFacultyUseCase } from "../use-cases/UpdateFacultyUseCase.js";
import { AssignFacultyDepartmentUseCase } from "../use-cases/AssignFacultyDepartmentUseCase.js";
import { DeactivateFacultyUseCase } from "../use-cases/DeactivateFacultyUseCase.js";

const facultyRepository = new FacultyRepository();

const userRepository = new UserRepository();

const departmentRepository = new DepartmentRepository();

export const facultyContainer = {

    createFaculty:

        new CreateFacultyUseCase(

            facultyRepository,

            userRepository,

            departmentRepository

        ),

    getFaculty:

        new GetFacultyUseCase(
            facultyRepository,
            userRepository
        ),

    getMyFacultyProfile:

        new GetMyFacultyProfileUseCase(
            facultyRepository
        ),

    getFaculties:

        new GetFacultiesUseCase(
            facultyRepository
        ),

    updateFaculty:

        new UpdateFacultyUseCase(
            facultyRepository
        ),

    assignFacultyDepartment:

        new AssignFacultyDepartmentUseCase(

            facultyRepository,

            departmentRepository

        ),

    deactivateFaculty:

        new DeactivateFacultyUseCase(
            facultyRepository
        )

};
