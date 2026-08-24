import { Student } from "../../../students/domain/entities/Student.js";
import { Activity } from "../entities/Activity.js";

/**
 * The single real activity-targeting check, extracted from
 * SubmissionEligibilityService's previously inline logic so this rule
 * lives in exactly one place - reused by both the real submission
 * gate (SubmissionEligibilityService, which still separately checks
 * status/deadline/duplicate submission, concerns beyond pure
 * targeting) and the new AI chat grounding context builder (which
 * needs to list which open activities a student can genuinely act on,
 * not just validate one specific submission attempt).
 *
 * No restriction set on a given dimension means unrestricted on that
 * dimension - matching the same "unset = unrestricted" convention
 * already established for Placement Drive eligibility criteria.
 */
export function isStudentEligibleForActivity(

    student: Student,

    activity: Activity

): boolean {

    const hasDepartmentRestriction = (activity.departmentIds?.length ?? 0) > 0;
    const hasBatchRestriction = (activity.batches?.length ?? 0) > 0;
    const hasSemesterRestriction = (activity.semesters?.length ?? 0) > 0;
    const hasSectionRestriction = (activity.sections?.length ?? 0) > 0;

    if (hasDepartmentRestriction && (!student.departmentId || !activity.departmentIds!.includes(student.departmentId))) {
        return false;
    }

    if (hasBatchRestriction && !activity.batches!.includes(student.batch)) {
        return false;
    }

    if (hasSemesterRestriction && !activity.semesters!.includes(student.semester)) {
        return false;
    }

    if (hasSectionRestriction && (!student.section || !activity.sections!.includes(student.section))) {
        return false;
    }

    return true;

}
