import { SubmissionRepository } from "../../infrastructure/repositories/SubmissionRepository.js";

import { ActivityRepository } from "../../../activities/infrastructure/repositories/ActivityRepository.js";

import { SubmissionEligibilityService } from "../services/SubmissionEligibilityService.js";

import { SubmitActivityUseCase } from "../use-cases/SubmitActivityUseCase.js";
import { ReviewSubmissionUseCase } from "../use-cases/ReviewSubmissionUseCase.js";
import { GetSubmissionUseCase } from "../use-cases/GetSubmissionUseCase.js";
import { ListSubmissionsUseCase } from "../use-cases/ListSubmissionsUseCase.js";
import { ResubmitSubmissionUseCase } from "../use-cases/ResubmitSubmissionUseCase.js";

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

        ),

    getSubmission:

        new GetSubmissionUseCase(

            submissionRepository

        ),

    listSubmissions:

        new ListSubmissionsUseCase(

            submissionRepository

        ),

    resubmitSubmission:

        new ResubmitSubmissionUseCase(

            submissionRepository

        )

};