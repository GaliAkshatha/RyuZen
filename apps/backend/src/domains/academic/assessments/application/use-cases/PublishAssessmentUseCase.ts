import { IAssessmentRepository } from "../../infrastructure/repositories/IAssessmentRepository.js";
import { IAssessmentQuestionRepository } from "../../infrastructure/repositories/IAssessmentQuestionRepository.js";

import { AssessmentResponseMapper } from "../../infrastructure/mappers/AssessmentResponseMapper.js";
import { AssessmentResponseDto } from "../dto/AssessmentResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/** totalMarks is computed here, for real, as the actual sum of every real question's marks - never entered manually, never able to drift from what students are actually scored against. */
export class PublishAssessmentUseCase {

    constructor(

        private readonly assessmentRepository: IAssessmentRepository,

        private readonly questionRepository: IAssessmentQuestionRepository

    ) {}

    async execute(

        assessmentId: string,

        organizationId: string

    ): Promise<AssessmentResponseDto> {

        const assessment =

            await this.assessmentRepository.findById(
                assessmentId
            );

        if (

            !assessment ||
            assessment.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Assessment not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const questions =

            await this.questionRepository.findByAssessment(
                assessmentId
            );

        if (questions.length === 0) {

            throw new ApiError(

                "Cannot publish an assessment with no real questions.",

                HttpStatus.BAD_REQUEST

            );

        }

        const totalMarks =

            questions.reduce(

                (sum, question) => sum + question.marks,

                0

            );

        assessment.publish(
            totalMarks
        );

        const updated =

            await this.assessmentRepository.save(
                assessment
            );

        return AssessmentResponseMapper.toDto(

            updated

        );

    }

}
