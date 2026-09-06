import { IInterviewExchange } from "../../domain/interfaces/IInterviewExchange.js";

import { InterviewFeedback } from "./InterviewFeedback.js";

export interface IMockInterviewProvider {

    /**
     * candidateContext is a real, evidence-based summary of the
     * student's own portfolio projects and approved skills - built
     * fresh from the database each call (see
     * buildCandidateContext.ts), not stored on the session itself.
     * Empty string is valid (a student with no portfolio yet still
     * gets a real interview, just without project-specific
     * questions).
     */
    nextQuestion(

        role: string,

        previousExchanges: IInterviewExchange[],

        candidateContext: string

    ): Promise<string>;

    /**
     * score is computed by the use case from real, already-stored
     * per-answer quality assessments (see
     * MockInterviewSession.recordAnswerQuality and
     * interviewPrompts.computeHybridScore) - the provider only writes
     * narrative feedback consistent with a number it did not invent,
     * matching the same deterministic-score principle this feature
     * always had, just computed from a richer real signal now.
     */
    generateFeedback(

        role: string,

        exchanges: IInterviewExchange[],

        score: number

    ): Promise<InterviewFeedback>;

    /**
     * Real, immediate per-answer content-quality assessment (0-100) -
     * called right after each answer is submitted, not just once at
     * the end. This is the "second signal" layered on top of the
     * deterministic length floor: a long-but-irrelevant answer scores
     * low here even though it passes the length gate, and a sharp
     * concise answer scores well here even though it's short. Drives
     * both adaptive difficulty (see MockInterviewSession.nextDifficulty())
     * and the final aggregate score.
     */
    assessAnswerQuality(

        question: string,

        answer: string

    ): Promise<number>;

}
