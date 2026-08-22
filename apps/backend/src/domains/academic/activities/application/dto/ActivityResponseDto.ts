import { ActivityStatus } from "../../domain/constants/ActivityStatus.js";
import { ActivityType } from "../../domain/constants/ActivityType.js";
import { ActivityVisibility } from "../../domain/constants/ActivityVisibility.js";
import { IAttachment } from "../../domain/interfaces/IAttachment.js";

export interface ActivityResponseDto {

    id: string;

    organizationId: string;

    createdBy: string;

    title: string;

    description: string;

    type: ActivityType;

    status: ActivityStatus;

    visibility: ActivityVisibility;

    departmentIds?: string[];

    batches?: string[];

    points: number;

    penaltyPoints: number;

    startDate: Date;

    endDate: Date;

    attachments: IAttachment[];

    createdAt?: Date;

    updatedAt?: Date;

}