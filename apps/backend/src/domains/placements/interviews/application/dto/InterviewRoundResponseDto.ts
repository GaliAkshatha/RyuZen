import { InterviewRoundType } from "../../domain/constants/InterviewRoundType.js";
import { InterviewRoundStatus } from "../../domain/constants/InterviewRoundStatus.js";

export interface InterviewRoundResponseDto {

    id: string;

    applicationId: string;

    roundType: InterviewRoundType;

    sequence: number;

    scheduledAt?: Date;

    interviewerId?: string;

    status: InterviewRoundStatus;

    evaluation?: {
        rating?: number;
        strengths?: string;
        weaknesses?: string;
        notes?: string;
    };

    completedAt?: Date;

    createdAt?: Date;

}
