import { MockInterviewSession } from "../../domain/entities/MockInterviewSession.js";

export interface IMockInterviewSessionRepository {

    create(
        session: MockInterviewSession
    ): Promise<MockInterviewSession>;

    findById(
        id: string
    ): Promise<MockInterviewSession | null>;

    findByUserId(
        userId: string
    ): Promise<MockInterviewSession[]>;

    save(
        session: MockInterviewSession
    ): Promise<MockInterviewSession>;

    /** Organization-wide AI usage count for the dashboard - same reasoning as IAIChatRepository.countByUserIds. */
    countByUserIds(
        userIds: string[]
    ): Promise<number>;

}
