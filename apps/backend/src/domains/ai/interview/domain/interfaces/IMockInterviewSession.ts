import { IInterviewExchange } from "./IInterviewExchange.js";

import { InterviewSessionStatus } from "../constants/InterviewSessionStatus.js";

export interface IMockInterviewSession {

    id?: string;

    userId: string;

    role: string;

    exchanges: IInterviewExchange[];

    status: InterviewSessionStatus;

    feedback?: string;

    score?: number;

    createdAt?: Date;

}
