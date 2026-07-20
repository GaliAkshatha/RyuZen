import { PlacementAnalyticsResponseDto } from "../dto/PlacementAnalyticsResponseDto.js";

import {
    ICompanyRepository,
} from "../../../companies/infrastructure/repositories/ICompanyRepository.js";

import { CompanyStatus } from "../../../companies/domain/constants/CompanyStatus.js";

import {
    IPlacementDriveRepository,
} from "../../../drives/infrastructure/repositories/IPlacementDriveRepository.js";

import { PlacementDriveStatus } from "../../../drives/domain/constants/PlacementDriveStatus.js";

import {
    IJobApplicationRepository,
} from "../../../applications/infrastructure/repositories/IJobApplicationRepository.js";

import { JobApplicationStatus } from "../../../applications/domain/constants/JobApplicationStatus.js";

export class GetPlacementAnalyticsUseCase {

    constructor(

        private readonly companyRepository: ICompanyRepository,

        private readonly placementDriveRepository: IPlacementDriveRepository,

        private readonly jobApplicationRepository: IJobApplicationRepository

    ) {}

    async execute(

        organizationId: string

    ): Promise<PlacementAnalyticsResponseDto> {

        const companies =

            await this.companyRepository.findByOrganization(
                organizationId
            );

        const drives =

            await this.placementDriveRepository.findByOrganization(

                organizationId,

                {}

            );

        const driveIds =

            drives.map(

                drive => drive.id!

            );

        const applications =

            driveIds.length > 0

                ? await this.jobApplicationRepository.findByPlacementIds(
                    driveIds
                )

                : [];

        const activeCompanies =

            companies.filter(

                company => company.status === CompanyStatus.ACTIVE

            ).length;

        const draftDrives =

            drives.filter(

                drive => drive.status === PlacementDriveStatus.DRAFT

            ).length;

        const publishedDrives =

            drives.filter(

                drive => drive.status === PlacementDriveStatus.PUBLISHED

            ).length;

        const closedDrives =

            drives.filter(

                drive => drive.status === PlacementDriveStatus.CLOSED

            ).length;

        const appliedCount =

            applications.filter(

                application => application.status === JobApplicationStatus.APPLIED

            ).length;

        const shortlistedCount =

            applications.filter(

                application => application.status === JobApplicationStatus.SHORTLISTED

            ).length;

        const rejectedCount =

            applications.filter(

                application => application.status === JobApplicationStatus.REJECTED

            ).length;

        const selectedCount =

            applications.filter(

                application => application.status === JobApplicationStatus.SELECTED

            ).length;

        const placementRate =

            applications.length > 0

                ? Math.round(

                    (selectedCount / applications.length) * 100

                )

                : 0;

        return {

            totalCompanies:
                companies.length,

            activeCompanies,

            totalDrives:
                drives.length,

            draftDrives,

            publishedDrives,

            closedDrives,

            totalApplications:
                applications.length,

            appliedCount,

            shortlistedCount,

            rejectedCount,

            selectedCount,

            placementRate

        };

    }

}
