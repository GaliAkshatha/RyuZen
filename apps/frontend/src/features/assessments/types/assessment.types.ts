export type AssessmentType = "APTITUDE" | "BRANCH_SPECIFIC" | "WEEKLY" | "COMPANY_SPECIFIC";
export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
export type QuestionType = "MCQ_SINGLE" | "MCQ_MULTIPLE" | "TRUE_FALSE";
export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED" | "EXPIRED";

export interface AssessmentResponseDto {
  id: string;
  title: string;
  description?: string;
  type: AssessmentType;
  departmentId?: string;
  durationMinutes: number;
  totalMarks: number;
  passingScore?: number;
  status: AssessmentStatus;
  startsAt?: string;
  endsAt?: string;
  createdAt?: string;
}

export interface CreateAssessmentPayload {
  title: string;
  description?: string;
  type: AssessmentType;
  departmentId?: string;
  durationMinutes: number;
  passingScore?: number;
  startsAt?: string;
  endsAt?: string;
}

/** The real faculty-facing view - includes correct answers, for review while building the assessment. */
export interface AssessmentQuestionResponseDto {
  id: string;
  assessmentId: string;
  questionText: string;
  type: QuestionType;
  options: string[];
  correctOptionIndexes: number[];
  marks: number;
  order: number;
}

/** The real student-facing view during an attempt - never includes correctOptionIndexes, confirmed against the backend DTO directly (the field doesn't exist on this type at all, not just hidden). */
export interface StudentAssessmentQuestionResponseDto {
  id: string;
  questionText: string;
  type: QuestionType;
  options: string[];
  marks: number;
  order: number;
}

export interface AddAssessmentQuestionPayload {
  questionText: string;
  type: QuestionType;
  options: string[];
  correctOptionIndexes: number[];
  marks: number;
  order?: number;
}

export interface AssessmentAttemptResponseDto {
  id: string;
  assessmentId: string;
  studentId: string;
  score?: number;
  status: AttemptStatus;
  startedAt: string;
  submittedAt?: string;
}

export interface RecordAssessmentAnswerPayload {
  questionId: string;
  selectedOptionIndexes: number[];
}
