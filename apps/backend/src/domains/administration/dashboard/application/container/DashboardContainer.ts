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

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";

import {
    LeaderboardRepository,
} from "../../../../campus/leaderboard/infrastructure/repositories/LeaderboardRepository.js";

import {
    CertificateRepository,
} from "../../../../campus/certificates/infrastructure/repositories/CertificateRepository.js";

import {
    PointLedgerRepository,
} from "../../../../campus/point-ledger/infrastructure/repositories/PointLedgerRepository.js";

import {
    AIChatRepository,
} from "../../../../ai/chat/infrastructure/repositories/AIChatRepository.js";

import {
    MockInterviewSessionRepository,
} from "../../../../ai/interview/infrastructure/repositories/MockInterviewSessionRepository.js";

import { GetDashboardUseCase } from "../use-cases/GetDashboardUseCase.js";

import { cacheService } from "../../../../../shared/infrastructure/cache/InMemoryCacheService.js";

const userRepository = new UserRepository();

const departmentRepository = new DepartmentRepository();

const activityRepository = new ActivityRepository();

const submissionRepository = new SubmissionRepository();

const clubRepository = new ClubRepository();

const eventRepository = new EventRepository();

const companyRepository = new CompanyRepository();

const placementDriveRepository = new PlacementDriveRepository();

const jobApplicationRepository = new JobApplicationRepository();

const studentRepository = new StudentRepository();

const leaderboardRepository = new LeaderboardRepository();

const certificateRepository = new CertificateRepository();

const pointLedgerRepository = new PointLedgerRepository();

const aiChatRepository = new AIChatRepository();

const mockInterviewSessionRepository = new MockInterviewSessionRepository();

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

            placementAnalyticsUseCase,

            studentRepository,

            leaderboardRepository,

            certificateRepository,

            pointLedgerRepository,

            aiChatRepository,

            mockInterviewSessionRepository,

            cacheService

        )

};
