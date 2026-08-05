import { InterviewRoundType } from "../../domain/constants/InterviewRoundType.js";

export interface ScheduleInterviewRoundDto {

    applicationId: string;

    roundType: InterviewRoundType;

    scheduledAt?: Date;

    interviewerId?: string;

}
