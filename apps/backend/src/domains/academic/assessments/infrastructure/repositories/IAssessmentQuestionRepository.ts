import { AssessmentQuestion } from "../../domain/entities/AssessmentQuestion.js";

export interface IAssessmentQuestionRepository {

    create(question: AssessmentQuestion): Promise<AssessmentQuestion>;

    findById(id: string): Promise<AssessmentQuestion | null>;

    findByAssessment(assessmentId: string): Promise<AssessmentQuestion[]>;

}
