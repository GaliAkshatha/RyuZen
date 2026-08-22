import { PlacementDriveStatus } from "../../domain/constants/PlacementDriveStatus.js";
import { EligibilityCriteria } from "../../domain/services/EligibilityCriteria.js";

export interface PlacementDriveResponseDto {

    id: string;

    organizationId: string;

    companyId: string;

    title: string;

    description?: string;

    package?: string;

    location?: string;

    eligibility?: string;

    /**
     * BACKEND GAP FIX: genuinely stored and enforced
     * (isStudentEligibleForDrive) but previously never returned to any
     * caller - this is what fixes the "silent 404 gap" the frontend
     * type file's own comment warned about. Now a real, honest
     * eligibility signal exists for the Placement Admin edit-form
     * data-loss bug that was flagged and left unfixed earlier this
     * engagement, and for a future student-facing eligibility check.
     */
    eligibilityCriteria?: EligibilityCriteria;

    deadline?: Date;

    status: PlacementDriveStatus;

    createdAt?: Date;

    updatedAt?: Date;

}
