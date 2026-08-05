import { AssessmentAttempt } from "../../domain/entities/AssessmentAttempt.js";

export interface IAssessmentAttemptRepository {

    create(attempt: AssessmentAttempt): Promise<AssessmentAttempt>;

    findById(id: string): Promise<AssessmentAttempt | null>;

    findByAssessmentAndStudent(assessmentId: string, studentId: string): Promise<AssessmentAttempt | null>;

    findByStudent(studentId: string): Promise<AssessmentAttempt[]>;

    findByAssessment(assessmentId: string): Promise<AssessmentAttempt[]>;

    save(attempt: AssessmentAttempt): Promise<AssessmentAttempt>;

}
