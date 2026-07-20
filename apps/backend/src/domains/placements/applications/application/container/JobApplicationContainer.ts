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

import { ApplyToPlacementUseCase } from "../use-cases/ApplyToPlacementUseCase.js";
import { GetJobApplicationUseCase } from "../use-cases/GetJobApplicationUseCase.js";
import { GetMyJobApplicationsUseCase } from "../use-cases/GetMyJobApplicationsUseCase.js";
import { GetJobApplicationsForPlacementUseCase } from "../use-cases/GetJobApplicationsForPlacementUseCase.js";
import { UpdateJobApplicationStatusUseCase } from "../use-cases/UpdateJobApplicationStatusUseCase.js";

const jobApplicationRepository = new JobApplicationRepository();

const placementDriveRepository = new PlacementDriveRepository();

const studentRepository = new StudentRepository();

const resumeRepository = new ResumeRepository();

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

            placementDriveRepository

        ),

    updateJobApplicationStatus:

        new UpdateJobApplicationStatusUseCase(

            jobApplicationRepository,

            placementDriveRepository

        )

};
