import { AssessmentType } from "../../domain/constants/AssessmentType.js";
import { AssessmentStatus } from "../../domain/constants/AssessmentStatus.js";

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

    startsAt?: Date;

    endsAt?: Date;

    createdAt?: Date;

}
