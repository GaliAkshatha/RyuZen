import { Chat } from "../../domain/entities/Chat.js";

import { ChatType } from "../../domain/constants/ChatType.js";

import { IChatRepository } from "../../infrastructure/repositories/IChatRepository.js";

import { ChatResponseMapper } from "../../infrastructure/mappers/ChatResponseMapper.js";

import { CreateChatDto } from "../dto/CreateChatDto.js";
import { ChatResponseDto } from "../dto/ChatResponseDto.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class CreateChatUseCase {

    constructor(

        private readonly repository: IChatRepository,

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        dto: CreateChatDto,

        organizationId: string,

        creatorUserId: string

    ): Promise<ChatResponseDto> {

        const participantIds =

            Array.from(

                new Set([

                    creatorUserId,

                    ...dto.participantIds

                ])

            );

        const type =

            dto.type ?? ChatType.DIRECT;

        if (

            type === ChatType.DIRECT &&
            participantIds.length !== 2

        ) {

            throw new ApiError(

                "A direct chat requires exactly two participants.",

                HttpStatus.BAD_REQUEST

            );

        }

        for (const participantId of participantIds) {

            const user =

                await this.userRepository.findById(
                    participantId
                );

            if (

                !user ||
                user.organizationId !== organizationId

            ) {

                throw new ApiError(

                    "One or more participants were not found.",

                    HttpStatus.NOT_FOUND

                );

            }

        }

        if (type === ChatType.DIRECT) {

            const [userIdA, userIdB] = participantIds;

            const existing =

                await this.repository.findDirectChatBetween(

                    organizationId,

                    userIdA!,

                    userIdB!

                );

            if (existing) {

                return ChatResponseMapper.toDto(

                    existing

                );

            }

        }

        const chat = Chat.create({

            organizationId,

            participants:
                participantIds,

            type

        });

        const created =

            await this.repository.create(

                chat

            );

        return ChatResponseMapper.toDto(

            created

        );

    }

}
