import { SubmissionStatus } from "../../domain/constants/SubmissionStatus.js";

import { IAttachment } from "../../../activities/domain/interfaces/IAttachment.js";

import { IReview } from "../../domain/interfaces/IReview.js";

export interface SubmissionResponseDto {

    id: string;

    activityId: string;

    organizationId: string;

    submittedBy: string;

    /** Enriched in ListSubmissionsUseCase - closes a real gap: previously the response only had a raw user id, unusable for a faculty reviewer or a CSV export without a second, wrongly-scoped request. */
    submittedByName?: string;

    submittedByUsn?: string;

    status: SubmissionStatus;

    remarks: string;

    attachments: IAttachment[];

    review: IReview;

    submittedAt: Date;

    createdAt?: Date;

    updatedAt?: Date;

}