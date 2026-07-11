import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { Department } from "../../domain/entities/Department.js";

import {
    IDepartmentRepository
} from "../../infrastructure/repositories/IDepartmentRepository.js";

export class GetDepartmentUseCase {

    constructor(
        private readonly repository: IDepartmentRepository
    ) {}

    async execute(
        id: string
    ): Promise<Department> {

        const department =
            await this.repository.findById(id);

        if (!department) {

            throw new ApiError(

                "Department not found.",

                HttpStatus.NOT_FOUND

            );

        }

        return department;

    }

}