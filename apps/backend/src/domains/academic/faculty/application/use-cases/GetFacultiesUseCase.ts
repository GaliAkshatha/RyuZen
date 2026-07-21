import { IFacultyRepository } from "../../infrastructure/repositories/IFacultyRepository.js";

import { FacultyResponseMapper } from "../../infrastructure/mappers/FacultyResponseMapper.js";

import { FacultyResponseDto } from "../dto/FacultyResponseDto.js";

export interface GetFacultiesFilterDto {

    departmentId?: string;

}

export class GetFacultiesUseCase {

    constructor(

        private readonly repository: IFacultyRepository

    ) {}

    async execute(

        organizationId: string,

        filters: GetFacultiesFilterDto

    ): Promise<FacultyResponseDto[]> {

        const faculties =

            await this.repository.findByOrganization(

                organizationId,

                {

                    departmentId: filters.departmentId

                }

            );

        return faculties.map(

            faculty =>

                FacultyResponseMapper.toDto(
                    faculty
                )

        );

    }

}
