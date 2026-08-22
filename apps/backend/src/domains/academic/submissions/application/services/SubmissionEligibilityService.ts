import { ActivityStatus } from "../../../activities/domain/constants/ActivityStatus.js";

import { IActivityRepository } from "../../../activities/infrastructure/repositories/IActivityRepository.js";

import { ISubmissionRepository } from "../../infrastructure/repositories/ISubmissionRepository.js";

import {
    IStudentRepository,
} from "../../../students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * SECURITY/BUSINESS-LOGIC FIX: an Activity's departmentIds/batches
 * (real fields, confirmed previously absent from IActivity - added
 * alongside this fix) were set on creation but never checked against
 * anything, making ActivityVisibility's DEPARTMENT/SEMESTER/YEAR
 * values purely decorative. A student outside the activity's real
 * target department/batch could submit to it regardless. Now enforced
 * here, the same real place organization/status/deadline/duplicate
 * are already correctly checked - not a second, parallel enforcement
 * path.
 */
export class SubmissionEligibilityService {

    constructor(

        private readonly activityRepository: IActivityRepository,

        private readonly submissionRepository: ISubmissionRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async validateSubmission(

        activityId: string,

        organizationId: string,

        submittedBy: string

    ): Promise<void> {

        const activity =

            await this.activityRepository.findById(

                activityId

            );

        if (!activity) {

            throw new ApiError(

                "Activity not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (

            activity.organizationId !==

            organizationId

        ) {

            throw new ApiError(

                "Activity does not belong to your organization.",

                HttpStatus.FORBIDDEN

            );

        }

        if (

            activity.status !==

            ActivityStatus.PUBLISHED

        ) {

            throw new ApiError(

                "Activity is not published.",

                HttpStatus.BAD_REQUEST

            );

        }

        if (

            activity.endDate <

            new Date()

        ) {

            throw new ApiError(

                "Submission deadline has passed.",

                HttpStatus.BAD_REQUEST

            );

        }

        const hasDepartmentRestriction =

            (activity.departmentIds?.length ?? 0) > 0;

        const hasBatchRestriction =

            (activity.batches?.length ?? 0) > 0;

        if (hasDepartmentRestriction || hasBatchRestriction) {

            const student =

                await this.studentRepository.findByUserId(

                    submittedBy

                );

            if (!student) {

                throw new ApiError(

                    "Only students may submit activities.",

                    HttpStatus.FORBIDDEN

                );

            }

            if (

                hasDepartmentRestriction &&
                (!student.departmentId ||
                    !activity.departmentIds!.includes(student.departmentId))

            ) {

                throw new ApiError(

                    "This activity is not available to your department.",

                    HttpStatus.FORBIDDEN

                );

            }

            if (

                hasBatchRestriction &&
                !activity.batches!.includes(student.batch)

            ) {

                throw new ApiError(

                    "This activity is not available to your batch.",

                    HttpStatus.FORBIDDEN

                );

            }

        }

        const submissions =

            await this.submissionRepository.findAll({

                activityId,

                submittedBy

            });

        if (

            submissions.length > 0

        ) {

            throw new ApiError(

                "You have already submitted this activity.",

                HttpStatus.CONFLICT

            );

        }

    }

}