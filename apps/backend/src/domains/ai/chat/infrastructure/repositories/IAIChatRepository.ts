import { AIChat } from "../../domain/entities/AIChat.js";

export interface IAIChatRepository {

    create(
        chat: AIChat
    ): Promise<AIChat>;

    findById(
        id: string
    ): Promise<AIChat | null>;

    findByUserId(
        userId: string
    ): Promise<AIChat[]>;

    save(
        chat: AIChat
    ): Promise<AIChat>;

}
