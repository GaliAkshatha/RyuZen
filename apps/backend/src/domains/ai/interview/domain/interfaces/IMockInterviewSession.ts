import { IInterviewExchange } from "./IInterviewExchange.js";

import { InterviewSessionStatus } from "../constants/InterviewSessionStatus.js";

export interface IMockInterviewSession {

    id?: string;

    userId: string;

    role: string;

    exchanges: IInterviewExchange[];

    status: InterviewSessionStatus;

    /**
     * The real, enforced time limit for this session, in minutes -
     * set once at creation (see StartMockInterviewSchema's real
     * bounds), checked against createdAt on every subsequent answer.
     * Not just a UI countdown - MockInterviewSession.isExpired() is
     * the real source of truth the backend itself enforces.
     */
    durationMinutes: number;

    feedback?: string;

    /**
     * Real, separately stored lists - not folded into the feedback
     * summary text. Each entry references something specific from the
     * actual transcript (see buildFeedbackPrompt) so the frontend can
     * render "what was good" and "where to improve" as genuinely
     * distinct, scannable sections.
     */
    strengths?: string[];

    improvements?: string[];

    score?: number;

    createdAt?: Date;

}
