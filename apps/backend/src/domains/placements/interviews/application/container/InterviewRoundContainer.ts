import { InterviewRoundRepository } from "../../infrastructure/repositories/InterviewRoundRepository.js";

import {
    JobApplicationRepository,
} from "../../../applications/infrastructure/repositories/JobApplicationRepository.js";

import {
    PlacementDriveRepository,
} from "../../../drives/infrastructure/repositories/PlacementDriveRepository.js";

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";

import { ScheduleInterviewRoundUseCase } from "../use-cases/ScheduleInterviewRoundUseCase.js";
import { RecordInterviewEvaluationUseCase } from "../use-cases/RecordInterviewEvaluationUseCase.js";
import { GetInterviewRoundsForApplicationUseCase } from "../use-cases/GetInterviewRoundsForApplicationUseCase.js";

import { notificationContainer } from "../../../../communication/notifications/application/container/NotificationContainer.js";

import { growthEventRecorder } from "../../../../../shared/infrastructure/growth/growthEventRecorder.js";

const interviewRoundRepository = new InterviewRoundRepository();

const jobApplicationRepository = new JobApplicationRepository();

const placementDriveRepository = new PlacementDriveRepository();

const studentRepository = new StudentRepository();

export const interviewRoundContainer = {

    scheduleInterviewRound:

        new ScheduleInterviewRoundUseCase(

            interviewRoundRepository,

            jobApplicationRepository,

            placementDriveRepository,

            studentRepository,

            notificationContainer.recordSystemNotification

        ),

    recordInterviewEvaluation:

        new RecordInterviewEvaluationUseCase(

            interviewRoundRepository,

            jobApplicationRepository,

            studentRepository,

            growthEventRecorder,

            notificationContainer.recordSystemNotification

        ),

    getInterviewRoundsForApplication:

        new GetInterviewRoundsForApplicationUseCase(

            interviewRoundRepository,

            jobApplicationRepository,

            studentRepository

        )

};
