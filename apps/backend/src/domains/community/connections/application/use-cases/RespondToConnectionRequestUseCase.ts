import { IConnectionRequestRepository } from "../../infrastructure/repositories/IConnectionRequestRepository.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { RecordSystemNotificationUseCase } from "../../../../communication/notifications/application/use-cases/RecordSystemNotificationUseCase.js";

import { ConnectionRequestResponseMapper } from "../../infrastructure/mappers/ConnectionRequestResponseMapper.js";
import { RespondToConnectionRequestDto } from "../dto/RespondToConnectionRequestDto.js";
import { ConnectionRequestResponseDto } from "../dto/ConnectionRequestResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/** Only the real recipient (toUserId) can respond - the sender can't accept their own request. 404, not 403, so a request's existence isn't leaked to someone who isn't a party to it. */
export class RespondToConnectionRequestUseCase {

    constructor(

        private readonly repository: IConnectionRequestRepository,

        private readonly userRepository: IUserRepository,

        private readonly recordSystemNotification: RecordSystemNotificationUseCase

    ) {}

    async execute(

        requestId: string,

        organizationId: string,

        respondingUserId: string,

        dto: RespondToConnectionRequestDto

    ): Promise<ConnectionRequestResponseDto> {

        const request =

            await this.repository.findById(
                requestId
            );

        if (

            !request ||
            request.organizationId !== organizationId ||
            request.toUserId !== respondingUserId

        ) {

            throw new ApiError(

                "Connection request not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (dto.accept) {

            request.accept();

        } else {

            request.reject();

        }

        const updated =

            await this.repository.save(
                request
            );

        const respondingUser =

            await this.userRepository.findById(
                respondingUserId
            );

        if (dto.accept) {

            await this.recordSystemNotification.execute({

                organizationId,

                recipientUserId: updated.fromUserId,

                senderId: respondingUserId,

                title: "Connection request accepted",

                message: `${respondingUser?.name ?? "Someone"} accepted your connection request.`

            }).catch(() => {
                // A notification failure must never break a real, already-recorded response.
            });

        }

        return ConnectionRequestResponseMapper.toDto(

            updated,

            respondingUser?.name ?? ""

        );

    }

}
