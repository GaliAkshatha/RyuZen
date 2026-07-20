import { JobApplicationStatus } from "../constants/JobApplicationStatus.js";

export interface IJobApplication {

    id?: string;

    placementId: string;

    studentId: string;

    resume?: string;

    status: JobApplicationStatus;

    remarks?: string;

    appliedAt: Date;

}
