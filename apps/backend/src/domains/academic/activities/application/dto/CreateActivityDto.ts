import { ActivityType } from "../../domain/constants/ActivityType.js";
import { ActivityVisibility } from "../../domain/constants/ActivityVisibility.js";
import { IAttachment } from "../../domain/interfaces/IAttachment.js";

export interface CreateActivityDto {

    title: string;

    description: string;

    type: ActivityType;

    visibility: ActivityVisibility;

    departmentIds?: string[];

    batches?: string[];

    semesters?: number[];

    sections?: string[];

    points: number;

    penaltyPoints: number;

    startDate: Date;

    endDate: Date;

    attachments: IAttachment[];

}