import { ActivityStatus } from "../../../activities/domain/constants/ActivityStatus.js";

import { IActivityRepository } from "../../../activities/infrastructure/repositories/IActivityRepository.js";

import { ISubmissionRepository } from "../../infrastructure/repositories/ISubmissionRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class SubmissionEligibilityService {

    constructor(

        private readonly activityRepository: IActivityRepository,

        private readonly submissionRepository: ISubmissionRepository

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