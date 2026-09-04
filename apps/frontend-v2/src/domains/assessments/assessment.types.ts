export const AssessmentStatus = { DRAFT: "DRAFT", PUBLISHED: "PUBLISHED", CLOSED: "CLOSED" } as const;
export type AssessmentStatus = (typeof AssessmentStatus)[keyof typeof AssessmentStatus];

export const AssessmentType = { APTITUDE: "APTITUDE", BRANCH_SPECIFIC: "BRANCH_SPECIFIC", WEEKLY: "WEEKLY", COMPANY_SPECIFIC: "COMPANY_SPECIFIC" } as const;
export type AssessmentType = (typeof AssessmentType)[keyof typeof AssessmentType];

export const AttemptStatus = { IN_PROGRESS: "IN_PROGRESS", SUBMITTED: "SUBMITTED", EXPIRED: "EXPIRED" } as const;
export type AttemptStatus = (typeof AttemptStatus)[keyof typeof AttemptStatus];

export const QuestionType = { MCQ_SINGLE: "MCQ_SINGLE", MCQ_MULTIPLE: "MCQ_MULTIPLE", TRUE_FALSE: "TRUE_FALSE" } as const;
export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType];

/** Matches the real backend AssessmentResponseDto exactly. */
export interface Assessment {
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

/**
 * The real, faculty-only view - includes correctOptionIndexes.
 * Matches AssessmentQuestionResponseDto exactly.
 */
export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  questionText: string;
  type: QuestionType;
  options: string[];
  correctOptionIndexes: number[];
  marks: number;
  order: number;
}

/**
 * The real student-attempt-safe view - matches
 * StudentAssessmentQuestionResponseDto exactly, deliberately never
 * includes correctOptionIndexes at the type level. Kept as a
 * genuinely separate type from AssessmentQuestion (not just the same
 * type with an optional field) so a student-facing component can
 * never even attempt to read a correct answer that was never sent.
 */
export interface StudentAssessmentQuestion {
  id: string;
  questionText: string;
  type: QuestionType;
  options: string[];
  marks: number;
  order: number;
}

/** Matches AssessmentAttemptResponseDto exactly. */
export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  studentId: string;
  score?: number;
  status: AttemptStatus;
  startedAt: string;
  submittedAt?: string;
}

/** Matches CreateAssessmentSchema exactly. */
export interface CreateAssessmentRequest {
  title: string;
  description?: string;
  type: AssessmentType;
  departmentId?: string;
  durationMinutes: number;
  passingScore?: number;
  startsAt?: string;
  endsAt?: string;
}

/** Matches AddAssessmentQuestionSchema exactly. */
export interface AddAssessmentQuestionRequest {
  questionText: string;
  type: QuestionType;
  options: string[];
  correctOptionIndexes: number[];
  marks: number;
}

/** Matches RecordAssessmentAnswerSchema exactly. */
export interface RecordAssessmentAnswerRequest {
  questionId: string;
  selectedOptionIndexes: number[];
}
