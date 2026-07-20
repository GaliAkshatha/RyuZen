import {
    CompanyRepository,
} from "../../../companies/infrastructure/repositories/CompanyRepository.js";

import {
    PlacementDriveRepository,
} from "../../../drives/infrastructure/repositories/PlacementDriveRepository.js";

import {
    JobApplicationRepository,
} from "../../../applications/infrastructure/repositories/JobApplicationRepository.js";

import { GetPlacementAnalyticsUseCase } from "../use-cases/GetPlacementAnalyticsUseCase.js";

const companyRepository = new CompanyRepository();

const placementDriveRepository = new PlacementDriveRepository();

const jobApplicationRepository = new JobApplicationRepository();

export const placementAnalyticsContainer = {

    getPlacementAnalytics:

        new GetPlacementAnalyticsUseCase(

            companyRepository,

            placementDriveRepository,

            jobApplicationRepository

        )

};
