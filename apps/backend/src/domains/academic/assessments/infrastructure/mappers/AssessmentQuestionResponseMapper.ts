import { AssessmentQuestion } from "../../domain/entities/AssessmentQuestion.js";

import {
    AssessmentQuestionResponseDto,
    StudentAssessmentQuestionResponseDto
} from "../../application/dto/AssessmentQuestionResponseDto.js";

export class AssessmentQuestionResponseMapper {

    static toDto(question: AssessmentQuestion): AssessmentQuestionResponseDto {

        return {
            id: question.id!,
            assessmentId: question.assessmentId,
            questionText: question.questionText,
            type: question.type,
            options: question.options,
            correctOptionIndexes: question.correctOptionIndexes,
            marks: question.marks,
            order: question.order
        };

    }

    /** Deliberately omits correctOptionIndexes entirely - not just hidden by the frontend, genuinely never sent to a student during their attempt. */
    static toStudentDto(question: AssessmentQuestion): StudentAssessmentQuestionResponseDto {

        return {
            id: question.id!,
            questionText: question.questionText,
            type: question.type,
            options: question.options,
            marks: question.marks,
            order: question.order
        };

    }

}
