import { IPlacementDriveRepository } from "../../infrastructure/repositories/IPlacementDriveRepository.js";

import { PlacementDriveResponseMapper } from "../../infrastructure/mappers/PlacementDriveResponseMapper.js";

import { PlacementDriveResponseDto } from "../dto/PlacementDriveResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class ClosePlacementDriveUseCase {

    constructor(

        private readonly repository: IPlacementDriveRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<PlacementDriveResponseDto> {

        const drive =

            await this.repository.findById(
                id
            );

        if (

            !drive ||
            drive.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Placement drive not found.",

                HttpStatus.NOT_FOUND

            );

        }

        drive.close();

        const updated =

            await this.repository.save(
                drive
            );

        return PlacementDriveResponseMapper.toDto(

            updated

        );

    }

}
