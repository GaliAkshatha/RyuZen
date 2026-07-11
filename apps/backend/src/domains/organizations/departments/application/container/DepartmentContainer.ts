import { DepartmentRepository } from "../../infrastructure/repositories/DepartmentRepository.js";

import { CreateDepartmentUseCase } from "../use-cases/CreateDepartmentUseCase.js";
import { GetDepartmentUseCase } from "../use-cases/GetDepartmentUseCase.js";
import { GetDepartmentsUseCase } from "../use-cases/GetDepartmentsUseCase.js";

const repository = new DepartmentRepository();

export const departmentContainer = {

    createDepartment:

        new CreateDepartmentUseCase(
            repository
        ),

    getDepartment:

        new GetDepartmentUseCase(
            repository
        ),

    getDepartments:

        new GetDepartmentsUseCase(
            repository
        )

};