import { IPlacementDriveRepository } from "../../infrastructure/repositories/IPlacementDriveRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class DeletePlacementDriveUseCase {

    constructor(

        private readonly repository: IPlacementDriveRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<void> {

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

        await this.repository.delete(

            id

        );

    }

}
