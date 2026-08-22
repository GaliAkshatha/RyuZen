import { SubmissionRepository } from "../../infrastructure/repositories/SubmissionRepository.js";

import { ActivityRepository } from "../../../activities/infrastructure/repositories/ActivityRepository.js";

import {
    StudentRepository,
} from "../../../students/infrastructure/repositories/StudentRepository.js";

import {
    pointLedgerContainer,
} from "../../../../campus/point-ledger/application/container/PointLedgerContainer.js";

import {
    notificationContainer,
} from "../../../../communication/notifications/application/container/NotificationContainer.js";

import { SubmissionEligibilityService } from "../services/SubmissionEligibilityService.js";

import { SubmitActivityUseCase } from "../use-cases/SubmitActivityUseCase.js";
import { ReviewSubmissionUseCase } from "../use-cases/ReviewSubmissionUseCase.js";
import { GetSubmissionUseCase } from "../use-cases/GetSubmissionUseCase.js";
import { ListSubmissionsUseCase } from "../use-cases/ListSubmissionsUseCase.js";
import { ResubmitSubmissionUseCase } from "../use-cases/ResubmitSubmissionUseCase.js";

import { growthEventRecorder } from "../../../../../shared/infrastructure/growth/growthEventRecorder.js";

const submissionRepository =
    new SubmissionRepository();

const activityRepository =
    new ActivityRepository();

const studentRepository =
    new StudentRepository();

const submissionEligibilityService =
    new SubmissionEligibilityService(

        activityRepository,

        submissionRepository,

        studentRepository

    );

export const submissionContainer = {

    submitActivity:

        new SubmitActivityUseCase(

            submissionRepository,

            submissionEligibilityService

        ),

    reviewSubmission:

        new ReviewSubmissionUseCase(

            submissionRepository,

            studentRepository,

            activityRepository,

            pointLedgerContainer.recordPointTransaction,

            notificationContainer.recordSystemNotification,

            growthEventRecorder

        ),

    getSubmission:

        new GetSubmissionUseCase(

            submissionRepository

        ),

    listSubmissions:

        new ListSubmissionsUseCase(

            submissionRepository,

            activityRepository

        ),

    resubmitSubmission:

        new ResubmitSubmissionUseCase(

            submissionRepository

        )

};