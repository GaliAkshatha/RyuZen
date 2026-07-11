import { SubmissionStatus } from "../../domain/constants/SubmissionStatus.js";

import { IAttachment } from "../../../activities/domain/interfaces/IAttachment.js";

import { IReview } from "../../domain/interfaces/IReview.js";

export interface SubmissionResponseDto {

    id: string;

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