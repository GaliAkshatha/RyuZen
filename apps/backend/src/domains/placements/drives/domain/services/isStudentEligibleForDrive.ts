import { Student } from "../../../../academic/students/domain/entities/Student.js";

import { EligibilityCriteria } from "./EligibilityCriteria.js";

/**
 * The single real eligibility check - used by BOTH
 * GetEligibleStudentsUseCase (the admin-facing list) and
 * ApplyToPlacementUseCase (the actual gate before a student can
 * apply at all). Extracted here specifically so these two call sites
 * can never drift apart - a student the admin view shows as
 * "eligible" must be exactly the same set of students who are
 * genuinely allowed to apply, not two independently-maintained copies
 * of the same rule.
 *
 * No criteria set at all means eligible - matching the free-text
 * `eligibility` field's existing default (unset = no restriction).
 */
export function isStudentEligibleForDrive(

    student: Student,

    criteria: EligibilityCriteria | undefined

): boolean {

    if (!criteria) {
        return true;
    }

    if (

        criteria.departmentIds &&
        criteria.departmentIds.length > 0 &&
        (!student.departmentId || !criteria.departmentIds.includes(student.departmentId))

    ) {

        return false;

    }

    if (

        criteria.minCgpa !== undefined &&
        (student.cgpa === undefined || student.cgpa < criteria.minCgpa)

    ) {

        return false;

    }

    if (

        criteria.minSemester !== undefined &&
        student.semester < criteria.minSemester

    ) {

        return false;

    }

    if (

        criteria.batches &&
        criteria.batches.length > 0 &&
        !criteria.batches.includes(student.batch)

    ) {

        return false;

    }

    return true;

}
