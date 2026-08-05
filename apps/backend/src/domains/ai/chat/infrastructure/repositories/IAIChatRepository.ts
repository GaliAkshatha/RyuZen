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

    /**
     * Organization-wide AI usage count for the dashboard — AIChat has
     * no organizationId of its own (only userId), so this goes
     * through the organization's real user list rather than
     * duplicating organizationId onto AIChat. A lightweight count,
     * not a fetch of full records, since the dashboard only needs the
     * number.
     */
    countByUserIds(
        userIds: string[]
    ): Promise<number>;

}
