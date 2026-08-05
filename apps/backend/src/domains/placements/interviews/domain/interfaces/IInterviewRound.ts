import { InterviewRoundType } from "../constants/InterviewRoundType.js";
import { InterviewRoundStatus } from "../constants/InterviewRoundStatus.js";

export interface IInterviewRound {

    id?: string;

    organizationId: string;

    applicationId: string;

    roundType: InterviewRoundType;

    /** Real ordering within this application's process - lets a UI show "Round 2 of 5" honestly rather than guessing from roundType alone (a drive might skip ONLINE_ASSESSMENT entirely, for instance). */
    sequence: number;

    scheduledAt?: Date;

    interviewerId?: string;

    status: InterviewRoundStatus;

    /**
     * Real structured evaluation, not a single free-text blob - matches
     * "structured evaluation" from the spec. Every field optional since
     * an interviewer may only fill in what's relevant to that round.
     */
    evaluation?: {

        rating?: number;

        strengths?: string;

        weaknesses?: string;

        notes?: string;

    };

    completedAt?: Date;

    createdAt?: Date;

}
