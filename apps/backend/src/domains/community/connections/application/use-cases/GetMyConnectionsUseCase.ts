import { IConnectionRequestRepository } from "../../infrastructure/repositories/IConnectionRequestRepository.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { ConnectionResponseDto } from "../dto/ConnectionResponseDto.js";

/** Real, accepted connections only - resolved to the real "other person" regardless of who originally sent the request. */
export class GetMyConnectionsUseCase {

    constructor(

        private readonly repository: IConnectionRequestRepository,

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        userId: string

    ): Promise<ConnectionResponseDto[]> {

        const requests =

            await this.repository.findAcceptedForUser(
                userId
            );

        const results: ConnectionResponseDto[] = [];

        for (const request of requests) {

            const otherUserId =
                request.otherUserId(userId);

            const otherUser =

                await this.userRepository.findById(
                    otherUserId
                );

            if (!otherUser) {
                continue;
            }

            results.push({

                connectionRequestId: request.id!,

                userId: otherUserId,

                name: otherUser.name,

                role: otherUser.role,

                avatarUrl: otherUser.profile.image || undefined,

                connectedSince: request.respondedAt

            });

        }

        return results;

    }

}
