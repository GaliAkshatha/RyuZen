import { IAttachment } from "../../../activities/domain/interfaces/IAttachment.js";

export interface ResubmitSubmissionDto {

    remarks: string;

    attachments: IAttachment[];

}
