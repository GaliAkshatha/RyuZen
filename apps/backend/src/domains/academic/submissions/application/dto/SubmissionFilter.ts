import { SubmissionStatus } from "../../domain/constants/SubmissionStatus.js";

export interface SubmissionFilter {

    organizationId?: string;

    activityId?: string;

    submittedBy?: string;

    status?: SubmissionStatus;

}