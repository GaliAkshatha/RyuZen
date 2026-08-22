import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { IActivityRepository } from "../../infrastructure/repositories/IActivityRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

/**
 * SECURITY FIX: previously called repository.delete(id) directly with
 * zero verification of any kind - not even that the activity existed,
 * let alone which organization it belonged to or who created it. Any
 * authenticated caller reaching this route could permanently delete
 * any activity in any organization. Now enforces the same real
 * org+ownership pattern as the other activity mutations, before an
 * irreversible delete rather than after.
 */
export class DeleteActivityUseCase {

    constructor(

        private readonly repository: IActivityRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        requesterId: string,

        requesterRole: UserRole

    ): Promise<void> {

        const activity =

            await this.repository.findById(id);

        if (

            !activity ||
            activity.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Activity not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (

            requesterRole !== UserRole.SUPER_ADMIN &&
            activity.createdBy !== requesterId

        ) {

            throw new ApiError(

                "Activity not found.",

                HttpStatus.NOT_FOUND

            );

        }

        await this.repository.delete(id);

    }

}
