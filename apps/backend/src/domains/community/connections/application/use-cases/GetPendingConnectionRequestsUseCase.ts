import { IConnectionRequestRepository } from "../../infrastructure/repositories/IConnectionRequestRepository.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { ConnectionRequestResponseMapper } from "../../infrastructure/mappers/ConnectionRequestResponseMapper.js";
import { ConnectionRequestResponseDto } from "../dto/ConnectionRequestResponseDto.js";

/** Real incoming requests only - the ones this user can actually accept or reject. */
export class GetPendingConnectionRequestsUseCase {

    constructor(

        private readonly repository: IConnectionRequestRepository,

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        userId: string

    ): Promise<ConnectionRequestResponseDto[]> {

        const requests =

            await this.repository.findPendingForUser(
                userId
            );

        const results: ConnectionRequestResponseDto[] = [];

        for (const request of requests) {

            const fromUser =

                await this.userRepository.findById(
                    request.fromUserId
                );

            results.push(

                ConnectionRequestResponseMapper.toDto(
                    request,
                    fromUser?.name ?? ""
                )

            );

        }

        return results;

    }

}
