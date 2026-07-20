import { Message } from "../../domain/entities/Message.js";

import { MessageModel } from "../persistence/MessageModel.js";

import { MessageMapper } from "../mappers/MessageMapper.js";

import { IMessageRepository } from "./IMessageRepository.js";

export class MessageRepository
implements IMessageRepository {

    async create(

        message: Message

    ): Promise<Message> {

        const document =

            await MessageModel.create(

                MessageMapper.toPersistence(

                    message

                )

            );

        return MessageMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Message | null> {

        const document =

            await MessageModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return MessageMapper.toDomain(

            document

        );

    }

    async findByChat(

        chatId: string

    ): Promise<Message[]> {

        const documents =

            await MessageModel.find({

                chatId

            })

                .sort({

                    createdAt: 1

                });

        return documents.map(

            document =>

                MessageMapper.toDomain(
                    document
                )

        );

    }

    async save(

        message: Message

    ): Promise<Message> {

        const document =

            await MessageModel.findByIdAndUpdate(

                message.id,

                MessageMapper.toPersistence(

                    message

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Message not found."

            );

        }

        return MessageMapper.toDomain(

            document

        );

    }

}
