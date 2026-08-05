import { AssessmentRepository } from "../../infrastructure/repositories/AssessmentRepository.js";
import { AssessmentQuestionRepository } from "../../infrastructure/repositories/AssessmentQuestionRepository.js";
import { AssessmentAttemptRepository } from "../../infrastructure/repositories/AssessmentAttemptRepository.js";

import {
    StudentRepository,
} from "../../../students/infrastructure/repositories/StudentRepository.js";

import { CreateAssessmentUseCase } from "../use-cases/CreateAssessmentUseCase.js";
import { AddAssessmentQuestionUseCase } from "../use-cases/AddAssessmentQuestionUseCase.js";
import { PublishAssessmentUseCase } from "../use-cases/PublishAssessmentUseCase.js";
import { StartAssessmentAttemptUseCase } from "../use-cases/StartAssessmentAttemptUseCase.js";
import { RecordAssessmentAnswerUseCase } from "../use-cases/RecordAssessmentAnswerUseCase.js";
import { SubmitAssessmentAttemptUseCase } from "../use-cases/SubmitAssessmentAttemptUseCase.js";
import { GetAssessmentQuestionsForAttemptUseCase } from "../use-cases/GetAssessmentQuestionsForAttemptUseCase.js";
import { GetOrganizationAssessmentsUseCase } from "../use-cases/GetOrganizationAssessmentsUseCase.js";
import { GetAssessmentResultsUseCase } from "../use-cases/GetAssessmentResultsUseCase.js";
import { GetMyAssessmentAttemptsUseCase } from "../use-cases/GetMyAssessmentAttemptsUseCase.js";

import { growthEventRecorder } from "../../../../../shared/infrastructure/growth/growthEventRecorder.js";

const assessmentRepository = new AssessmentRepository();

const questionRepository = new AssessmentQuestionRepository();

const attemptRepository = new AssessmentAttemptRepository();

const studentRepository = new StudentRepository();

export const assessmentContainer = {

    createAssessment:

        new CreateAssessmentUseCase(
            assessmentRepository
        ),

    addQuestion:

        new AddAssessmentQuestionUseCase(

            assessmentRepository,

            questionRepository

        ),

    publishAssessment:

        new PublishAssessmentUseCase(

            assessmentRepository,

            questionRepository

        ),

    startAttempt:

        new StartAssessmentAttemptUseCase(

            assessmentRepository,

            attemptRepository,

            studentRepository

        ),

    recordAnswer:

        new RecordAssessmentAnswerUseCase(

            attemptRepository,

            assessmentRepository,

            studentRepository

        ),

    submitAttempt:

        new SubmitAssessmentAttemptUseCase(

            attemptRepository,

            assessmentRepository,

            questionRepository,

            studentRepository,

            growthEventRecorder

        ),

    getQuestionsForAttempt:

        new GetAssessmentQuestionsForAttemptUseCase(
            questionRepository
        ),

    getOrganizationAssessments:

        new GetOrganizationAssessmentsUseCase(
            assessmentRepository
        ),

    getAssessmentResults:

        new GetAssessmentResultsUseCase(

            assessmentRepository,

            attemptRepository

        ),

    getMyAttempts:

        new GetMyAssessmentAttemptsUseCase(

            attemptRepository,

            studentRepository

        )

};
