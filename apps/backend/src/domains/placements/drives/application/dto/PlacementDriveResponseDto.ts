import { PlacementDriveStatus } from "../../domain/constants/PlacementDriveStatus.js";

export interface PlacementDriveResponseDto {

    id: string;

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
