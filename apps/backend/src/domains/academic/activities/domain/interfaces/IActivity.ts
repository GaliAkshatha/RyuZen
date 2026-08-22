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

    /** Which departments this activity is scoped to when visibility is DEPARTMENT. Empty/undefined means no department restriction. */
    departmentIds?: string[];

    /** Which batches this activity is scoped to. Empty/undefined means no batch restriction. */
    batches?: string[];

    /** Which semesters this activity is scoped to (e.g. [6] for 6th semester only). Empty/undefined means no semester restriction. */
    semesters?: number[];

    /** Which sections this activity is scoped to (e.g. ["B"]). Empty/undefined means no section restriction. */
    sections?: string[];

    points: number;

    penaltyPoints: number;

    startDate: Date;

    endDate: Date;

    attachments: IAttachment[];

    createdAt?: Date;

    updatedAt?: Date;

}