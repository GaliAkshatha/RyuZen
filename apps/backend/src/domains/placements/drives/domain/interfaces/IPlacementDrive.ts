import { PlacementDriveStatus } from "../constants/PlacementDriveStatus.js";

export interface IPlacementDrive {

    id?: string;

    organizationId: string;

    companyId: string;

    title: string;

    description?: string;

    package?: string;

    location?: string;

    eligibility?: string;

    deadline?: Date;

    status: PlacementDriveStatus;

    createdAt?: Date;

    updatedAt?: Date;

}
