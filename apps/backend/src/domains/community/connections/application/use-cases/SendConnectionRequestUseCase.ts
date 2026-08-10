import { ConnectionRequest } from "../../domain/entities/ConnectionRequest.js";
import { ConnectionRequestStatus } from "../../domain/constants/ConnectionRequestStatus.js";

import { IConnectionRequestRepository } from "../../infrastructure/repositories/IConnectionRequestRepository.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { RecordSystemNotificationUseCase } from "../../../../communication/notifications/application/use-cases/RecordSystemNotificationUseCase.js";

import { ConnectionRequestResponseMapper } from "../../infrastructure/mappers/ConnectionRequestResponseMapper.js";
import { SendConnectionRequestDto } from "../dto/SendConnectionRequestDto.js";
import { ConnectionRequestResponseDto } from "../dto/ConnectionRequestResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Real duplicate/self-connect prevention - checks BOTH directions for
 * any existing PENDING or ACCEPTED record before creating a new one,
 * not just the exact (from, to) pair the database index alone would
 * catch. A real rejection genuinely allows trying again (a new
 * request), matching a real "I changed my mind" scenario.
 */
export class SendConnectionRequestUseCase {

    constructor(

        private readonly repository: IConnectionRequestRepository,

        private readonly userRepository: IUserRepository,

        private readonly recordSystemNotification: RecordSystemNotificationUseCase

    ) {}

    async execute(

        organizationId: string,

        fromUserId: string,

        dto: SendConnectionRequestDto

    ): Promise<ConnectionRequestResponseDto> {

        if (fromUserId === dto.toUserId) {

            throw new ApiError(

                "You can't send a connection request to yourself.",

                HttpStatus.BAD_REQUEST

            );

        }

        const toUser =

            await this.userRepository.findById(
                dto.toUserId
            );

        if (

            !toUser ||
            toUser.organizationId !== organizationId ||
            toUser.role === UserRole.ORG_ADMIN ||
            toUser.role === UserRole.SUPER_ADMIN

        ) {

            throw new ApiError(

                "User not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const existing =

            await this.repository.findBetween(
                fromUserId,
                dto.toUserId
            );

        if (

            existing &&
            existing.status !== ConnectionRequestStatus.REJECTED

        ) {

            throw new ApiError(

                existing.status === ConnectionRequestStatus.ACCEPTED
                    ? "You're already connected."
                    : "A connection request is already pending between you two.",

                HttpStatus.CONFLICT

            );

        }

        const fromUser =

            await this.userRepository.findById(
                fromUserId
            );

        const request = ConnectionRequest.create({

            organizationId,

            fromUserId,

            toUserId: dto.toUserId,

            status: ConnectionRequestStatus.PENDING

        });

        const created =

            await this.repository.create(
                request
            );

        await this.recordSystemNotification.execute({

            organizationId,

            recipientUserId: dto.toUserId,

            senderId: fromUserId,

            title: "New connection request",

            message: `${fromUser?.name ?? "Someone"} wants to connect with you.`

        }).catch(() => {
            // A notification failure must never break a real, already-sent request.
        });

        return ConnectionRequestResponseMapper.toDto(

            created,

            fromUser?.name ?? ""

        );

    }

}
