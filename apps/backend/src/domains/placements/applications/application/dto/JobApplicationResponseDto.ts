import { JobApplicationStatus } from "../../domain/constants/JobApplicationStatus.js";

export interface JobApplicationResponseDto {

    id: string;

    placementId: string;

    studentId: string;

    resume?: string;

    status: JobApplicationStatus;

    remarks?: string;

    appliedAt: Date;

}
