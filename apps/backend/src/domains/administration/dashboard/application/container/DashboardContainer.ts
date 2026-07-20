import {
    UserRepository,
} from "../../../../identity/infrastructure/repositories/UserRepository.js";

import {
    DepartmentRepository,
} from "../../../../academic/departments/infrastructure/repositories/DepartmentRepository.js";

import {
    ActivityRepository,
} from "../../../../academic/activities/infrastructure/repositories/ActivityRepository.js";

import {
    SubmissionRepository,
} from "../../../../academic/submissions/infrastructure/repositories/SubmissionRepository.js";

import {
    ClubRepository,
} from "../../../../campus/clubs/infrastructure/repositories/ClubRepository.js";

import {
    EventRepository,
} from "../../../../campus/events/infrastructure/repositories/EventRepository.js";

import {
    CompanyRepository,
} from "../../../../placements/companies/infrastructure/repositories/CompanyRepository.js";

import {
    PlacementDriveRepository,
} from "../../../../placements/drives/infrastructure/repositories/PlacementDriveRepository.js";

import {
    JobApplicationRepository,
} from "../../../../placements/applications/infrastructure/repositories/JobApplicationRepository.js";

import {
    GetPlacementAnalyticsUseCase,
} from "../../../../placements/analytics/application/use-cases/GetPlacementAnalyticsUseCase.js";

import { GetDashboardUseCase } from "../use-cases/GetDashboardUseCase.js";

const userRepository = new UserRepository();

const departmentRepository = new DepartmentRepository();

const activityRepository = new ActivityRepository();

const submissionRepository = new SubmissionRepository();

const clubRepository = new ClubRepository();

const eventRepository = new EventRepository();

const companyRepository = new CompanyRepository();

const placementDriveRepository = new PlacementDriveRepository();

const jobApplicationRepository = new JobApplicationRepository();

const placementAnalyticsUseCase =

    new GetPlacementAnalyticsUseCase(

        companyRepository,

        placementDriveRepository,

        jobApplicationRepository

    );

export const dashboardContainer = {

    getDashboard:

        new GetDashboardUseCase(

            userRepository,

            departmentRepository,

            activityRepository,

            submissionRepository,

            clubRepository,

            eventRepository,

            placementAnalyticsUseCase

        )

};
