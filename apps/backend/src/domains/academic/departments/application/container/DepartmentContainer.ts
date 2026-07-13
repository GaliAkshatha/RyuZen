import { DepartmentRepository } from "../../infrastructure/repositories/DepartmentRepository.js";

import { UserRepository } from "../../../../identity/infrastructure/repositories/UserRepository.js";

import { CreateDepartmentUseCase } from "../use-cases/CreateDepartmentUseCase.js";
import { GetDepartmentUseCase } from "../use-cases/GetDepartmentUseCase.js";
import { GetDepartmentsUseCase } from "../use-cases/GetDepartmentsUseCase.js";
import { UpdateDepartmentUseCase } from "../use-cases/UpdateDepartmentUseCase.js";
import { DeleteDepartmentUseCase } from "../use-cases/DeleteDepartmentUseCase.js";
import { AssignHeadOfDepartmentUseCase } from "../use-cases/AssignHeadOfDepartmentUseCase.js";

const departmentRepository = new DepartmentRepository();

const userRepository = new UserRepository();

export const departmentContainer = {

    createDepartment:

        new CreateDepartmentUseCase(
            departmentRepository
        ),

    getDepartment:

        new GetDepartmentUseCase(
            departmentRepository
        ),

    getDepartments:

        new GetDepartmentsUseCase(
            departmentRepository
        ),

    updateDepartment:

        new UpdateDepartmentUseCase(
            departmentRepository
        ),

    deleteDepartment:

        new DeleteDepartmentUseCase(
            departmentRepository
        ),

    assignHeadOfDepartment:

        new AssignHeadOfDepartmentUseCase(

            departmentRepository,

            userRepository

        )

};
