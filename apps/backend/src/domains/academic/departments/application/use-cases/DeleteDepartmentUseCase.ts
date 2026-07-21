import { IDepartmentRepository } from "../../infrastructure/repositories/IDepartmentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class DeleteDepartmentUseCase {

    constructor(

        private readonly repository: IDepartmentRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<void> {

        const department =

            await this.repository.findById(
                id
            );

        if (

            !department ||
            department.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Department not found.",

                HttpStatus.NOT_FOUND

            );

        }

        await this.repository.delete(

            id

        );

    }

}
