import { AIChat } from "../../domain/entities/AIChat.js";

import { AIChatModel } from "../persistence/AIChatModel.js";

import { AIChatMapper } from "../mappers/AIChatMapper.js";

import { IAIChatRepository } from "./IAIChatRepository.js";

export class AIChatRepository
implements IAIChatRepository {

    async create(

        chat: AIChat

    ): Promise<AIChat> {

        const document =

            await AIChatModel.create(

                AIChatMapper.toPersistence(

                    chat

                )

            );

        return AIChatMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<AIChat | null> {

        const document =

            await AIChatModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return AIChatMapper.toDomain(

            document

        );

    }

    async findByUserId(

        userId: string

    ): Promise<AIChat[]> {

        const documents =

            await AIChatModel.find({

                userId

            })

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                AIChatMapper.toDomain(
                    document
                )

        );

    }

    async save(

        chat: AIChat

    ): Promise<AIChat> {

        const document =

            await AIChatModel.findByIdAndUpdate(

                chat.id,

                AIChatMapper.toPersistence(

                    chat

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "AI chat not found."

            );

        }

        return AIChatMapper.toDomain(

            document

        );

    }

}
