import { IInvitationRepository } from "../../infrastructure/repositories/IInvitationRepository.js";

import { InvitationResponseMapper } from "../../infrastructure/mappers/InvitationResponseMapper.js";
import { InvitationResponseDto } from "../dto/InvitationResponseDto.js";

export class GetOrganizationInvitationsUseCase {

    constructor(

        private readonly invitationRepository: IInvitationRepository

    ) {}

    async execute(

        organizationId: string

    ): Promise<InvitationResponseDto[]> {

        const invitations =

            await this.invitationRepository.findByOrganization(
                organizationId
            );

        return invitations.map(

            invitation => InvitationResponseMapper.toDto(invitation)

        );

    }

}
