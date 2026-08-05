import { InterviewRound } from "../../domain/entities/InterviewRound.js";

export interface IInterviewRoundRepository {

    create(
        round: InterviewRound
    ): Promise<InterviewRound>;

    findById(
        id: string
    ): Promise<InterviewRound | null>;

    findByApplication(
        applicationId: string
    ): Promise<InterviewRound[]>;

    save(
        round: InterviewRound
    ): Promise<InterviewRound>;

}
