import { AssessmentType } from "../constants/AssessmentType.js";
import { AssessmentStatus } from "../constants/AssessmentStatus.js";

export interface IAssessment {

    id?: string;

    organizationId: string;

    title: string;

    description?: string;

    type: AssessmentType;

    createdBy: string;

    /** Restricts to one department when set - unset means open to the whole organization. */
    departmentId?: string;

    durationMinutes: number;

    /** Real, computed from the sum of every question's marks at publish time - never set independently, so it can never drift from what the questions actually add up to. */
    totalMarks: number;

    passingScore?: number;

    status: AssessmentStatus;

    startsAt?: Date;

    endsAt?: Date;

    createdAt?: Date;

    updatedAt?: Date;

}
