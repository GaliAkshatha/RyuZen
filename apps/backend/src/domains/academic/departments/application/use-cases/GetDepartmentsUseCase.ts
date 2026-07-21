import { IDepartmentRepository } from "../../infrastructure/repositories/IDepartmentRepository.js";

import { DepartmentResponseMapper } from "../../infrastructure/mappers/DepartmentResponseMapper.js";

import { DepartmentResponseDto } from "../dto/DepartmentResponseDto.js";

export class GetDepartmentsUseCase {

    constructor(

        private readonly repository: IDepartmentRepository

    ) {}

    async execute(

        organizationId: string

    ): Promise<DepartmentResponseDto[]> {

        const departments =

            await this.repository.findByOrganization(
                organizationId
            );

        return departments.map(

            department =>

                DepartmentResponseMapper.toDto(
                    department
                )

        );

    }

}
