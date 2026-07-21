import { IDepartmentRepository } from "../../infrastructure/repositories/IDepartmentRepository.js";

import { DepartmentResponseMapper } from "../../infrastructure/mappers/DepartmentResponseMapper.js";

import { DepartmentResponseDto } from "../dto/DepartmentResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetDepartmentUseCase {

    constructor(

        private readonly repository: IDepartmentRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<DepartmentResponseDto> {

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

        return DepartmentResponseMapper.toDto(

            department

        );

    }

}
