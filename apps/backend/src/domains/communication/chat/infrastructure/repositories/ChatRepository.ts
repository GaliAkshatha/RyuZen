import { Chat } from "../../domain/entities/Chat.js";

import { ChatModel } from "../persistence/ChatModel.js";

import { ChatMapper } from "../mappers/ChatMapper.js";

import { IChatRepository } from "./IChatRepository.js";

import { ChatType } from "../../domain/constants/ChatType.js";

export class ChatRepository
implements IChatRepository {

    async create(

        chat: Chat

    ): Promise<Chat> {

        const document =

            await ChatModel.create(

                ChatMapper.toPersistence(

                    chat

                )

            );

        return ChatMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Chat | null> {

        const document =

            await ChatModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return ChatMapper.toDomain(

            document

        );

    }

    async findByParticipant(

        organizationId: string,

        userId: string

    ): Promise<Chat[]> {

        const documents =

            await ChatModel.find({

                organizationId,

                participants: userId

            })

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                ChatMapper.toDomain(
                    document
                )

        );

    }

    async findDirectChatBetween(

        organizationId: string,

        userIdA: string,

        userIdB: string

    ): Promise<Chat | null> {

        const document =

            await ChatModel.findOne({

                organizationId,

                type: ChatType.DIRECT,

                participants: {

                    $all: [userIdA, userIdB],

                    $size: 2

                }

            });

        if (!document) {

            return null;

        }

        return ChatMapper.toDomain(

            document

        );

    }

    async save(

        chat: Chat

    ): Promise<Chat> {

        const document =

            await ChatModel.findByIdAndUpdate(

                chat.id,

                ChatMapper.toPersistence(

                    chat

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Chat not found."

            );

        }

        return ChatMapper.toDomain(

            document

        );

    }

}
