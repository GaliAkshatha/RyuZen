import { AssessmentType } from "../../domain/constants/AssessmentType.js";

export interface CreateAssessmentDto {

    title: string;

    description?: string;

    type: AssessmentType;

    departmentId?: string;

    durationMinutes: number;

    passingScore?: number;

    startsAt?: Date;

    endsAt?: Date;

}
