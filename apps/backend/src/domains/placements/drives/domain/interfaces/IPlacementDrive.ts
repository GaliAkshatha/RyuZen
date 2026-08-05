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

    /**
     * Structured, machine-evaluable criteria - what GetEligibleStudentsUseCase
     * actually evaluates against real Student records. The free-text
     * `eligibility` field above stays as-is for human display; this is
     * the real gate. Deliberately does NOT include a backlog count -
     * no real backlog tracking exists anywhere in the Student domain
     * today, and fabricating a threshold against data that isn't
     * tracked would silently make every student "pass" it.
     * Every field is optional and an empty/undefined value means "no
     * restriction on this dimension" - a drive with no criteria set at
     * all is open to every student, matching the existing free-text
     * field's default behavior today.
     */
    eligibilityCriteria?: {

        departmentIds?: string[];

        minCgpa?: number;

        minSemester?: number;

        batches?: string[];

    };

    deadline?: Date;

    status: PlacementDriveStatus;

    createdAt?: Date;

    updatedAt?: Date;

}
