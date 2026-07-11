import { IAttachment } from "../../../activities/domain/interfaces/IAttachment.js";

export interface CreateSubmissionDto {

    activityId: string;

    remarks: string;

    attachments: IAttachment[];

}