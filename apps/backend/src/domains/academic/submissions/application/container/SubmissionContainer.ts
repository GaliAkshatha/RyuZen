import { SubmissionRepository } from "../../infrastructure/repositories/SubmissionRepository.js";

import { ActivityRepository } from "../../../activities/infrastructure/repositories/ActivityRepository.js";

import { SubmissionEligibilityService } from "../services/SubmissionEligibilityService.js";

import { SubmitActivityUseCase } from "../use-cases/SubmitActivityUseCase.js";
import { ReviewSubmissionUseCase } from "../use-cases/ReviewSubmissionUseCase.js";

const submissionRepository =
    new SubmissionRepository();

const activityRepository =
    new ActivityRepository();

const submissionEligibilityService =
    new SubmissionEligibilityService(

        activityRepository,

        submissionRepository

    );

export const submissionContainer = {

    submitActivity:

        new SubmitActivityUseCase(

            submissionRepository,

            submissionEligibilityService

        ),

    reviewSubmission:

        new ReviewSubmissionUseCase(

            submissionRepository

        )

};