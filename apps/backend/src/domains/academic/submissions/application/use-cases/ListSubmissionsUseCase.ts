import { SubmissionFilter } from "../dto/SubmissionFilter.js";
import { SubmissionResponseDto } from "../dto/SubmissionResponseDto.js";

import { SubmissionResponseMapper } from "../mappers/SubmissionResponseMapper.js";

import { ISubmissionRepository } from "../../infrastructure/repositories/ISubmissionRepository.js";

import {
    IActivityRepository,
} from "../../../activities/infrastructure/repositories/IActivityRepository.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import {
    IStudentRepository,
} from "../../../students/infrastructure/repositories/IStudentRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * SECURITY FIX: previously had no role restriction and trusted the
 * client-provided submittedBy filter completely - any authenticated
 * user, including a student, could list any other student's
 * submissions (remarks, attachments, review feedback) by passing
 * their id, or see the entire organization's submissions by omitting
 * the filter. Fixed with real, role-appropriate scoping, the same
 * "never trust the client for scope" principle already applied to
 * Faculty's facultyId filter earlier this engagement:
 *
 * - STUDENT: submittedBy is always forced to their own real id,
 *   regardless of what was requested - they can never list anyone
 *   else's submissions this way.
 * - FACULTY: must provide a real activityId they genuinely created
 *   (the same ownership check already proven in
 *   ReviewSubmissionUseCase) - browsing all submissions org-wide,
 *   even their own activities' worth, without specifying which
 *   activity is not allowed.
 * - ORG_ADMIN / SUPER_ADMIN: full organization-scoped access, no
 *   further restriction - matches their existing broad oversight role.
 *
 * Route-level authorizePermission restricts callers to these four
 * roles - any other authenticated role is rejected before reaching
 * this use case at all.
 */
export class ListSubmissionsUseCase {

    constructor(

        private readonly repository: ISubmissionRepository,

        private readonly activityRepository: IActivityRepository,

        private readonly userRepository: IUserRepository,

        private readonly studentRepository: IStudentRepository

    ) {}

    async execute(

        filter: SubmissionFilter,

        requesterId: string,

        requesterRole: UserRole

    ): Promise<SubmissionResponseDto[]> {

        let effectiveFilter: SubmissionFilter = filter;

        if (requesterRole === UserRole.STUDENT) {

            effectiveFilter = {

                ...filter,

                submittedBy: requesterId

            };

        }

        if (requesterRole === UserRole.FACULTY) {

            if (!filter.activityId) {

                throw new ApiError(

                    "A specific activityId is required to list submissions.",

                    HttpStatus.BAD_REQUEST

                );

            }

            const activity =

                await this.activityRepository.findById(
                    filter.activityId
                );

            if (

                !activity ||
                activity.organizationId !== filter.organizationId ||
                activity.createdBy !== requesterId

            ) {

                throw new ApiError(

                    "Activity not found.",

                    HttpStatus.NOT_FOUND

                );

            }

        }

        const submissions =

            await this.repository.findAll(
                effectiveFilter
            );

        const uniqueSubmitterIds =

            Array.from(
                new Set(
                    submissions.map(s => s.submittedBy)
                )
            );

        const nameById = new Map<string, string>();
        const usnById = new Map<string, string>();

        for (const submitterId of uniqueSubmitterIds) {

            const user =

                await this.userRepository.findById(
                    submitterId
                );

            if (user) {

                nameById.set(submitterId, user.name);

            }

            const student =

                await this.studentRepository.findByUserId(
                    submitterId
                );

            if (student?.usn) {

                usnById.set(submitterId, student.usn);

            }

        }

        return submissions.map(
            submission => ({
                ...SubmissionResponseMapper.toDto(
                    submission
                ),
                submittedByName: nameById.get(submission.submittedBy),
                submittedByUsn: usnById.get(submission.submittedBy)
            })
        );

    }

}
