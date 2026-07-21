import { ActivityStatus } from "../constants/ActivityStatus.js";
import { ActivityType } from "../constants/ActivityType.js";
import { ActivityVisibility } from "../constants/ActivityVisibility.js";
import { IAttachment } from "./IAttachment.js";

export interface IActivity {

    id?: string;

    organizationId: string;

    createdBy: string;

    title: string;

    description: string;

    type: ActivityType;

    status: ActivityStatus;

    visibility: ActivityVisibility;

    points: number;

    penaltyPoints: number;

    startDate: Date;

    endDate: Date;

    attachments: IAttachment[];

    createdAt?: Date;

    updatedAt?: Date;

}