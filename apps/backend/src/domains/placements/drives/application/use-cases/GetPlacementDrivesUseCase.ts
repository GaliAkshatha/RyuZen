import { IPlacementDriveRepository } from "../../infrastructure/repositories/IPlacementDriveRepository.js";

import { PlacementDriveResponseMapper } from "../../infrastructure/mappers/PlacementDriveResponseMapper.js";

import { PlacementDriveResponseDto } from "../dto/PlacementDriveResponseDto.js";

export interface GetPlacementDrivesFilterDto {

    companyId?: string;

    status?: string;

}

export class GetPlacementDrivesUseCase {

    constructor(

        private readonly repository: IPlacementDriveRepository

    ) {}

    async execute(

        organizationId: string,

        filters: GetPlacementDrivesFilterDto

    ): Promise<PlacementDriveResponseDto[]> {

        const drives =

            await this.repository.findByOrganization(

                organizationId,

                {

                    companyId: filters.companyId,

                    status: filters.status

                }

            );

        return drives.map(

            drive =>

                PlacementDriveResponseMapper.toDto(
                    drive
                )

        );

    }

}
