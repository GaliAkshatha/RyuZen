import { InterviewSessionStatus } from "../../domain/constants/InterviewSessionStatus.js";

import { InterviewExchangeResponseDto } from "./InterviewExchangeResponseDto.js";

export interface MockInterviewSessionResponseDto {

    id: string;

    userId: string;

    role: string;

    exchanges: InterviewExchangeResponseDto[];

    status: InterviewSessionStatus;

    durationMinutes: number;

    /**
     * A real, derived value (durationMinutes / MAX_QUESTIONS) - not a
     * separately stored field, so it can never drift out of sync with
     * the real overall duration. This is what the frontend uses to
     * render a real per-question countdown.
     */
    perQuestionSeconds: number;

    feedback?: string;

    strengths?: string[];

    improvements?: string[];

    score?: number;

    createdAt?: Date;

}
