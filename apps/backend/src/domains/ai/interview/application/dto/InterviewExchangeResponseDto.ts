import { InterviewDifficulty } from "../../domain/interfaces/IInterviewExchange.js";

export interface InterviewExchangeResponseDto {

    question: string;

    difficulty: InterviewDifficulty;

    answer?: string;

    qualityScore?: number;

    askedAt: Date;

    answeredAt?: Date;

}
