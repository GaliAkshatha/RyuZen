/**
 * The real, structured shape used across IPlacementDrive, the
 * PlacementDrive entity, its DTOs, and isStudentEligibleForDrive.
 * Every field optional; unset means "no restriction on this
 * dimension" everywhere it's checked.
 */
export interface EligibilityCriteria {

    departmentIds?: string[];

    minCgpa?: number;

    minSemester?: number;

    batches?: string[];

}
