import { IConnectionRequestRepository } from "../../infrastructure/repositories/IConnectionRequestRepository.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { UserStatus } from "../../../../identity/domain/constants/UserStatus.js";
import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { ConnectableUserResponseDto } from "../dto/ConnectableUserResponseDto.js";

/**
 * "See people and request to connect" - the real directory. Only ever
 * exposes name/role/avatar (see ConnectableUserResponseDto's own
 * comment on why) and only ever shows genuinely ACTIVE accounts in the
 * caller's own real organization - never another org's people, never
 * an invited-but-not-yet-active account.
 *
 * ORG_ADMIN and SUPER_ADMIN are deliberately excluded from the
 * results entirely - explicit rule: platform/org administrators don't
 * participate in the social connection graph, and other users
 * shouldn't be able to send them connection requests. Enforced here
 * (never shown as browsable) and again in
 * SendConnectionRequestUseCase (never accepted even if a caller
 * somehow already has the id).
 */
export class GetConnectableUsersUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly connectionRequestRepository: IConnectionRequestRepository

    ) {}

    async execute(

        organizationId: string,

        requestingUserId: string

    ): Promise<ConnectableUserResponseDto[]> {

        const users =

            await this.userRepository.findByOrganization(
                organizationId
            );

        const others =

            users.filter(

                user =>
                    user.id !== requestingUserId &&
                    user.status === UserStatus.ACTIVE &&
                    user.role !== UserRole.ORG_ADMIN &&
                    user.role !== UserRole.SUPER_ADMIN

            );

        const results: ConnectableUserResponseDto[] = [];

        for (const user of others) {

            const existing =

                await this.connectionRequestRepository.findBetween(
                    requestingUserId,
                    user.id!
                );

            let connectionStatus: ConnectableUserResponseDto["connectionStatus"];

            if (existing?.status === "ACCEPTED") {

                connectionStatus = "ACCEPTED";

            } else if (existing?.status === "PENDING") {

                connectionStatus =
                    existing.fromUserId === requestingUserId
                        ? "PENDING_SENT"
                        : "PENDING_RECEIVED";

            }

            results.push({

                id: user.id!,

                name: user.name,

                role: user.role,

                avatarUrl: user.profile.image || undefined,

                connectionStatus

            });

        }

        return results;

    }

}
