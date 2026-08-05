import { IInterviewExchange } from "../../domain/interfaces/IInterviewExchange.js";

/**
 * Shared between OllamaMockInterviewProvider and GeminiMockInterviewProvider.
 * MIN_ANSWER_LENGTH and the score formula are deterministic on purpose
 * and must never differ by provider - see both providers' doc comments.
 */
export const MIN_ANSWER_LENGTH = 20;

export function computeInterviewScore(exchanges: IInterviewExchange[]): number {
    const substantiveAnswers = exchanges.filter(
        exchange => (exchange.answer?.trim().length ?? 0) >= MIN_ANSWER_LENGTH
    ).length;

    return exchanges.length > 0
        ? Math.round((substantiveAnswers / exchanges.length) * 100)
        : 0;
}

export function buildQuestionPrompt(
    role: string,
    previousExchanges: IInterviewExchange[]
): string {
    const history =
        previousExchanges.length > 0
            ? previousExchanges
                .map(
                    (exchange, i) =>
                        `${i + 1}. Q: ${exchange.question}\n   A: ${exchange.answer ?? "(no answer given)"}`
                )
                .join("\n")
            : "(this is the first question)";

    return `You are conducting a mock job interview for the role of "${role || "a general position"}" on a campus placement platform.

Questions already asked in this session:
${history}

Ask ONE new interview question appropriate for this role, that has not already been asked above. Respond with ONLY the question text, no numbering, no preamble, no quotation marks.`;
}

export function buildFeedbackPrompt(
    role: string,
    exchanges: IInterviewExchange[],
    score: number
): string {
    const transcript = exchanges
        .map(
            (exchange, i) =>
                `${i + 1}. Q: ${exchange.question}\n   A: ${exchange.answer ?? "(no answer given)"}`
        )
        .join("\n");

    return `You are a mock interview coach reviewing a completed interview for the role of "${role || "a general position"}" on a campus placement platform.

Transcript:
${transcript}

A separate, deterministic system has already computed a score of ${score}/100 based on how many answers were substantive. Do not invent a different score.

Respond with ONLY 2-4 sentences of specific, constructive feedback on the actual answers above — what was strong, what was weak, and one concrete suggestion for improvement. No preamble, no headers, no JSON.`;
}
