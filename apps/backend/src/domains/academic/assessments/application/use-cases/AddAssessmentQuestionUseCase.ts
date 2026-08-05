import { AssessmentQuestion } from "../../domain/entities/AssessmentQuestion.js";

import { IAssessmentRepository } from "../../infrastructure/repositories/IAssessmentRepository.js";
import { IAssessmentQuestionRepository } from "../../infrastructure/repositories/IAssessmentQuestionRepository.js";

import { AssessmentQuestionResponseMapper } from "../../infrastructure/mappers/AssessmentQuestionResponseMapper.js";

import { AddAssessmentQuestionDto } from "../dto/AddAssessmentQuestionDto.js";
import { AssessmentQuestionResponseDto } from "../dto/AssessmentQuestionResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/** Real, honest validation - correctOptionIndexes must actually be valid indexes into the real options array, never trusted blindly. Only ever allowed on a DRAFT assessment - a published assessment's questions are frozen, since changing them mid-flight would invalidate real students' in-progress or already-submitted attempts. */
export class AddAssessmentQuestionUseCase {

    constructor(

        private readonly assessmentRepository: IAssessmentRepository,

        private readonly questionRepository: IAssessmentQuestionRepository

    ) {}

    async execute(

        assessmentId: string,

        organizationId: string,

        dto: AddAssessmentQuestionDto,

        order: number

    ): Promise<AssessmentQuestionResponseDto> {

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

        if (assessment.status !== "DRAFT") {

            throw new ApiError(

                "Questions can only be added to a draft assessment.",

                HttpStatus.BAD_REQUEST

            );

        }

        if (dto.options.length < 2) {

            throw new ApiError(

                "A question needs at least 2 real options.",

                HttpStatus.BAD_REQUEST

            );

        }

        if (dto.correctOptionIndexes.length === 0) {

            throw new ApiError(

                "A question needs at least one real correct answer.",

                HttpStatus.BAD_REQUEST

            );

        }

        const invalidIndex =

            dto.correctOptionIndexes.some(

                index => index < 0 || index >= dto.options.length

            );

        if (invalidIndex) {

            throw new ApiError(

                "A correct answer index must point to a real option.",

                HttpStatus.BAD_REQUEST

            );

        }

        const question = AssessmentQuestion.create({

            assessmentId,

            questionText: dto.questionText,

            type: dto.type,

            options: dto.options,

            correctOptionIndexes: dto.correctOptionIndexes,

            marks: dto.marks,

            order

        });

        const created =

            await this.questionRepository.create(
                question
            );

        return AssessmentQuestionResponseMapper.toDto(

            created

        );

    }

}
