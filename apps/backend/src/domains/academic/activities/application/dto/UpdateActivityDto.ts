import { ActivityType } from "../../domain/constants/ActivityType.js";
import { ActivityVisibility } from "../../domain/constants/ActivityVisibility.js";
import { IAttachment } from "../../domain/interfaces/IAttachment.js";

export interface UpdateActivityDto {

    title?: string;

    description?: string;

    type?: ActivityType;

    visibility?: ActivityVisibility;

    points?: number;

    penaltyPoints?: number;

    startDate?: Date;

    endDate?: Date;

    attachments?: IAttachment[];

}