import { IInterviewExchange } from "../../domain/interfaces/IInterviewExchange.js";

import { InterviewFeedback } from "./InterviewFeedback.js";

export interface IMockInterviewProvider {

    nextQuestion(

        role: string,

        previousExchanges: IInterviewExchange[]

    ): Promise<string>;

    generateFeedback(

        role: string,

        exchanges: IInterviewExchange[]

    ): Promise<InterviewFeedback>;

}
