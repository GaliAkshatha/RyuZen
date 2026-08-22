import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { IPlacementDriveRepository } from "../../infrastructure/repositories/IPlacementDriveRepository.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { isStudentEligibleForDrive } from "../../domain/services/isStudentEligibleForDrive.js";

export interface EligibilityCheckResponseDto {

    eligible: boolean;

    /** Real, human-readable reasons the student fails specific criteria - built from the same fields isStudentEligibleForDrive checks, never invented text. Empty when eligible or when the drive has no criteria at all. */
    reasons: string[];

}

/**
 * BACKEND GAP FIX: closes the "no student-facing eligibility signal"
 * gap flagged repeatedly through this engagement. Reuses the exact
 * same isStudentEligibleForDrive() function already proven correct
 * for GetEligibleStudentsUseCase and ApplyToPlacementUseCase - a
 * student told "eligible" here is guaranteed to be allowed to
 * actually apply, since it's the identical real check, not a second,
 * independently-maintained copy of the rule that could drift.
 */
export class CheckMyEligibilityUseCase {

    constructor(

        private readonly driveRepository: IPlacementDriveRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        driveId: string,

        organizationId: string,

        requesterId: string

    ): Promise<EligibilityCheckResponseDto> {

        const drive =

            await this.driveRepository.findById(driveId);

        if (

            !drive ||
            drive.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Placement drive not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const student =

            await this.studentRepository.findByUserId(requesterId);

        if (!student) {

            throw new ApiError(

                "Only students may check drive eligibility.",

                HttpStatus.FORBIDDEN

            );

        }

        const criteria = drive.eligibilityCriteria;

        const eligible = isStudentEligibleForDrive(student, criteria);

        const reasons: string[] = [];

        if (!eligible && criteria) {

            if (

                criteria.departmentIds &&
                criteria.departmentIds.length > 0 &&
                (!student.departmentId || !criteria.departmentIds.includes(student.departmentId))

            ) {

                reasons.push("Your department is not eligible for this drive.");

            }

            if (

                criteria.minCgpa !== undefined &&
                (student.cgpa === undefined || student.cgpa < criteria.minCgpa)

            ) {

                reasons.push(`Requires a minimum CGPA of ${criteria.minCgpa}.`);

            }

            if (

                criteria.minSemester !== undefined &&
                student.semester < criteria.minSemester

            ) {

                reasons.push(`Requires minimum semester ${criteria.minSemester}.`);

            }

            if (

                criteria.batches &&
                criteria.batches.length > 0 &&
                !criteria.batches.includes(student.batch)

            ) {

                reasons.push("Your batch is not eligible for this drive.");

            }

        }

        return { eligible, reasons };

    }

}
