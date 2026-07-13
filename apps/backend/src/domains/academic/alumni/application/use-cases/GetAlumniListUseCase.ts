import { IAlumniRepository } from "../../infrastructure/repositories/IAlumniRepository.js";

import { AlumniResponseMapper } from "../../infrastructure/mappers/AlumniResponseMapper.js";

import { AlumniResponseDto } from "../dto/AlumniResponseDto.js";

export interface GetAlumniListFilterDto {

    status?: string;

    isVerified?: boolean;

    graduationYear?: number;

}

export class GetAlumniListUseCase {

    constructor(

        private readonly repository: IAlumniRepository

    ) {}

    async execute(

        organizationId: string,

        filters: GetAlumniListFilterDto

    ): Promise<AlumniResponseDto[]> {

        const alumniList =

            await this.repository.findByOrganization(

                organizationId,

                {

                    status: filters.status,

                    isVerified: filters.isVerified,

                    graduationYear: filters.graduationYear

                }

            );

        return alumniList.map(

            alumni =>

                AlumniResponseMapper.toDto(
                    alumni
                )

        );

    }

}
