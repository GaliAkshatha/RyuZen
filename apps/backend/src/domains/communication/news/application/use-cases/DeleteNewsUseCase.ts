import { INewsRepository } from "../../infrastructure/repositories/INewsRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * A real, sensible moderation rule: the person who posted it can
 * remove their own post, and an Org Admin can remove anyone's post in
 * their own organization (real oversight, matching the same
 * authority Org Admin already has over Faculty/Placement Admin
 * elsewhere in this system) - nobody else, and never across a
 * different organization even if they somehow guessed a real id.
 */
export class DeleteNewsUseCase {

    constructor(

        private readonly repository: INewsRepository

    ) {}

    async execute(

        newsId: string,

        organizationId: string,

        callerId: string,

        callerRole: UserRole

    ): Promise<void> {

        const news =

            await this.repository.findById(
                newsId
            );

        if (

            !news ||
            news.organizationId !== organizationId

        ) {

            throw new ApiError(

                "News post not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const canDelete =

            news.authorId === callerId ||
            callerRole === UserRole.ORG_ADMIN;

        if (!canDelete) {

            throw new ApiError(

                "You can only remove your own posts.",

                HttpStatus.FORBIDDEN

            );

        }

        await this.repository.delete(

            newsId

        );

    }

}
