import { JobApplicationRepository } from "../../infrastructure/repositories/JobApplicationRepository.js";

import {
    PlacementDriveRepository,
} from "../../../drives/infrastructure/repositories/PlacementDriveRepository.js";

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";

import {
    ResumeRepository,
} from "../../../../career/resume/infrastructure/repositories/ResumeRepository.js";

import {
    UserRepository,
} from "../../../../identity/infrastructure/repositories/UserRepository.js";

import { ApplyToPlacementUseCase } from "../use-cases/ApplyToPlacementUseCase.js";
import { GetJobApplicationUseCase } from "../use-cases/GetJobApplicationUseCase.js";
import { GetMyJobApplicationsUseCase } from "../use-cases/GetMyJobApplicationsUseCase.js";
import { GetJobApplicationsForPlacementUseCase } from "../use-cases/GetJobApplicationsForPlacementUseCase.js";
import { UpdateJobApplicationStatusUseCase } from "../use-cases/UpdateJobApplicationStatusUseCase.js";

import { growthEventRecorder } from "../../../../../shared/infrastructure/growth/growthEventRecorder.js";
import { recruiterCandidateAccessService } from "../../../../../shared/container/RecruiterCandidateAccessContainer.js";

import {
    notificationContainer,
} from "../../../../communication/notifications/application/container/NotificationContainer.js";

const jobApplicationRepository = new JobApplicationRepository();

const placementDriveRepository = new PlacementDriveRepository();

const studentRepository = new StudentRepository();

const resumeRepository = new ResumeRepository();

const userRepository = new UserRepository();

export const jobApplicationContainer = {

    applyToPlacement:

        new ApplyToPlacementUseCase(

            jobApplicationRepository,

            placementDriveRepository,

            studentRepository,

            resumeRepository

        ),

    getJobApplication:

        new GetJobApplicationUseCase(

            jobApplicationRepository,

            placementDriveRepository,

            studentRepository

        ),

    getMyJobApplications:

        new GetMyJobApplicationsUseCase(

            jobApplicationRepository,

            studentRepository

        ),

    getJobApplicationsForPlacement:

        new GetJobApplicationsForPlacementUseCase(

            jobApplicationRepository,

            placementDriveRepository,

            studentRepository,

            userRepository

        ),

    updateJobApplicationStatus:

        new UpdateJobApplicationStatusUseCase(

            jobApplicationRepository,

            placementDriveRepository,

            studentRepository,

            notificationContainer.recordSystemNotification,

            growthEventRecorder,

            recruiterCandidateAccessService

        )

};
