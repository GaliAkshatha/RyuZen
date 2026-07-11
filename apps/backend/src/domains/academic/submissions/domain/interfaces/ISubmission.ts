import { SubmissionStatus } from "../constants/SubmissionStatus.js";

import { IReview } from "./IReview.js";

import { IAttachment } from "../../../activities/domain/interfaces/IAttachment.js";

export interface ISubmission {

    id?: string;

    activityId: string;

    organizationId: string;

    submittedBy: string;

    status: SubmissionStatus;

    remarks: string;

    attachments: IAttachment[];

    review: IReview;

    submittedAt: Date;

    createdAt?: Date;

    updatedAt?: Date;

}