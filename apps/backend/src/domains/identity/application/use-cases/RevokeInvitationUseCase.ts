import { IInvitationRepository } from "../../infrastructure/repositories/IInvitationRepository.js";

import { InvitationStatus } from "../../domain/constants/InvitationStatus.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

export class RevokeInvitationUseCase {

    constructor(

        private readonly invitationRepository: IInvitationRepository

    ) {}

    async execute(

        invitationId: string,

        organizationId: string

    ): Promise<void> {

        const invitation =

            await this.invitationRepository.findById(
                invitationId
            );

        if (

            !invitation ||
            invitation.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Invitation not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (invitation.status === InvitationStatus.ACCEPTED) {

            throw new ApiError(

                "This invitation has already been accepted and cannot be revoked.",

                HttpStatus.BAD_REQUEST

            );

        }

        invitation.revoke();

        await this.invitationRepository.save(
            invitation
        );

    }

}
