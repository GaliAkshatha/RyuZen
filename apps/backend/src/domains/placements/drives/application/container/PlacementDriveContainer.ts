import { PlacementDriveRepository } from "../../infrastructure/repositories/PlacementDriveRepository.js";

import {
    CompanyRepository,
} from "../../../companies/infrastructure/repositories/CompanyRepository.js";

import { CreatePlacementDriveUseCase } from "../use-cases/CreatePlacementDriveUseCase.js";
import { GetPlacementDriveUseCase } from "../use-cases/GetPlacementDriveUseCase.js";
import { GetPlacementDrivesUseCase } from "../use-cases/GetPlacementDrivesUseCase.js";
import { UpdatePlacementDriveUseCase } from "../use-cases/UpdatePlacementDriveUseCase.js";
import { DeletePlacementDriveUseCase } from "../use-cases/DeletePlacementDriveUseCase.js";
import { PublishPlacementDriveUseCase } from "../use-cases/PublishPlacementDriveUseCase.js";
import { ClosePlacementDriveUseCase } from "../use-cases/ClosePlacementDriveUseCase.js";

const placementDriveRepository = new PlacementDriveRepository();

const companyRepository = new CompanyRepository();

export const placementDriveContainer = {

    createPlacementDrive:

        new CreatePlacementDriveUseCase(

            placementDriveRepository,

            companyRepository

        ),

    getPlacementDrive:

        new GetPlacementDriveUseCase(
            placementDriveRepository
        ),

    getPlacementDrives:

        new GetPlacementDrivesUseCase(
            placementDriveRepository
        ),

    updatePlacementDrive:

        new UpdatePlacementDriveUseCase(
            placementDriveRepository
        ),

    deletePlacementDrive:

        new DeletePlacementDriveUseCase(
            placementDriveRepository
        ),

    publishPlacementDrive:

        new PublishPlacementDriveUseCase(
            placementDriveRepository
        ),

    closePlacementDrive:

        new ClosePlacementDriveUseCase(
            placementDriveRepository
        )

};
