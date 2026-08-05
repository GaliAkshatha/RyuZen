import { AssessmentQuestion } from "../../domain/entities/AssessmentQuestion.js";
import { QuestionType } from "../../domain/constants/QuestionType.js";

import { AssessmentQuestionDocument } from "../persistence/AssessmentQuestionModel.js";

export class AssessmentQuestionMapper {

    static toDomain(document: AssessmentQuestionDocument): AssessmentQuestion {

        return AssessmentQuestion.create({

            id: document.id,
            assessmentId: document.assessmentId.toString(),
            questionText: document.questionText,
            type: document.type as QuestionType,
            options: document.options,
            correctOptionIndexes: document.correctOptionIndexes,
            marks: document.marks,
            order: document.order,
            createdAt: document.createdAt

        });

    }

    static toPersistence(question: AssessmentQuestion) {

        const data = question.toObject();

        return {
            assessmentId: data.assessmentId,
            questionText: data.questionText,
            type: data.type,
            options: data.options,
            correctOptionIndexes: data.correctOptionIndexes,
            marks: data.marks,
            order: data.order
        };

    }

}
