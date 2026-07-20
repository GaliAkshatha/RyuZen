import { JobApplicationStatus } from "../../domain/constants/JobApplicationStatus.js";

export interface UpdateJobApplicationStatusDto {

    status: JobApplicationStatus;

    remarks?: string;

}
