import { QuestionType } from "../../domain/constants/QuestionType.js";

export interface AddAssessmentQuestionDto {

    questionText: string;

    type: QuestionType;

    options: string[];

    correctOptionIndexes: number[];

    marks: number;

}
