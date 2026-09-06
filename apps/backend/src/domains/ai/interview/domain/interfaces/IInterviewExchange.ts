export type InterviewDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface IInterviewExchange {

    question: string;

    /** The difficulty this specific question was asked at - recorded per-question since adaptive difficulty means later questions in the same session may differ from earlier ones. */
    difficulty: InterviewDifficulty;

    answer?: string;

    /**
     * Real AI-assessed content quality (0-100) for this specific
     * answer, assessed immediately on submission - not just at the
     * end of the interview. This is what actually drives adaptive
     * difficulty in real time, and what the final score is built
     * from (gated by the deterministic length floor - see
     * computeExchangeScore in interviewPrompts.ts).
     */
    qualityScore?: number;

    askedAt: Date;

    answeredAt?: Date;

}
