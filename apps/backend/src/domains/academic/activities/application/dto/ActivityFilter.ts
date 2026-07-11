import { ActivityStatus } from "../../domain/constants/ActivityStatus.js";
import { ActivityType } from "../../domain/constants/ActivityType.js";
import { ActivityVisibility } from "../../domain/constants/ActivityVisibility.js";

export interface ActivityFilter {

    organizationId: string;

    status?: ActivityStatus;

    type?: ActivityType;

    visibility?: ActivityVisibility;

    createdBy?: string;

}