import { IMockInterviewProvider } from "../../application/ports/IMockInterviewProvider.js";
import { IInterviewExchange } from "../../domain/interfaces/IInterviewExchange.js";
import { InterviewFeedback } from "../../application/ports/InterviewFeedback.js";

import { OllamaClient } from "../../../../../shared/infrastructure/ai/OllamaClient.js";

import { buildQuestionPrompt, buildFeedbackPrompt, buildQualityAssessmentPrompt, parseQualityScore, parseFeedbackResponse } from "./interviewPrompts.js";

/*
 Real Ollama-backed mock interview. nextQuestion is genuinely
 role-aware and avoids repeating prior questions. generateFeedback's
 SCORE is computed upstream by the use case (real hybrid scoring, see
 interviewPrompts.computeHybridScore) - this only writes the
 narrative feedback text consistent with a score it did not invent.
*/

export class OllamaMockInterviewProvider implements IMockInterviewProvider {
    async nextQuestion(
        role: string,
        previousExchanges: IInterviewExchange[],
        candidateContext: string
    ): Promise<string> {
        const prompt = buildQuestionPrompt(role, previousExchanges, candidateContext);
        return OllamaClient.generateText(prompt);
    }

    async generateFeedback(
        role: string,
        exchanges: IInterviewExchange[],
        score: number
    ): Promise<InterviewFeedback> {
        const prompt = buildFeedbackPrompt(role, exchanges, score);
        const raw = await OllamaClient.generateText(prompt);
        return parseFeedbackResponse(raw);
    }

    async assessAnswerQuality(
        question: string,
        answer: string
    ): Promise<number> {
        const prompt = buildQualityAssessmentPrompt(question, answer);
        const raw = await OllamaClient.generateText(prompt);
        return parseQualityScore(raw);
    }
}
