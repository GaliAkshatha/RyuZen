import { IInterviewExchange } from "../../domain/interfaces/IInterviewExchange.js";

import { InterviewFeedback } from "../../application/ports/InterviewFeedback.js";

/**
 * Shared between OllamaMockInterviewProvider and GeminiMockInterviewProvider.
 * MIN_ANSWER_LENGTH and the score formula are deterministic on purpose
 * and must never differ by provider - see both providers' doc comments.
 */
export const MIN_ANSWER_LENGTH = 20;

/**
 * The real number of questions per interview - a single source of
 * truth shared between AnswerMockInterviewUseCase (decides when to
 * complete) and MockInterviewSessionResponseMapper (derives
 * perQuestionSeconds for the frontend). Previously duplicated as a
 * local constant in the use case only - moved here so the two can
 * never drift out of sync.
 */
export const MAX_QUESTIONS = 5;

export function computeInterviewScore(exchanges: IInterviewExchange[]): number {
    const substantiveAnswers = exchanges.filter(
        exchange => (exchange.answer?.trim().length ?? 0) >= MIN_ANSWER_LENGTH
    ).length;

    return exchanges.length > 0
        ? Math.round((substantiveAnswers / exchanges.length) * 100)
        : 0;
}

/**
 * The real hybrid score: for each exchange, the deterministic length
 * check is a GATE, not the grade itself - an answer under
 * MIN_ANSWER_LENGTH scores 0 for that question regardless of its
 * recorded qualityScore (this is the part that can't be gamed by a
 * lazy one-liner, even a confidently-worded one). An answer that
 * clears the gate is graded by its real, already-assessed AI content
 * quality - not just credited in full for existing, the way the old
 * computeInterviewScore did. Falls back to 50 (a neutral score) for
 * an exchange that passed the gate but somehow has no recorded
 * qualityScore yet, rather than silently treating it as 0 or 100.
 *
 * A real pacing penalty is also applied: an answer that took more
 * than 1.5x its fair per-question time share gets a modest 15%
 * reduction - real interviews have a pace, and a technically good
 * but very slow answer shouldn't score identically to an equally
 * good, well-paced one. Deliberately mild (not zeroed out) since a
 * single hard question genuinely taking longer than average isn't
 * itself a failure.
 */
export function computeHybridScore(exchanges: IInterviewExchange[], durationMinutes: number): number {
    if (exchanges.length === 0) {
        return 0;
    }

    const budgetSeconds = (durationMinutes * 60) / MAX_QUESTIONS;

    const perExchangeScores = exchanges.map(exchange => {
        const isSubstantive = (exchange.answer?.trim().length ?? 0) >= MIN_ANSWER_LENGTH;
        if (!isSubstantive) {
            return 0;
        }

        const baseScore = exchange.qualityScore ?? 50;

        if (exchange.answeredAt) {
            const elapsedSeconds = (exchange.answeredAt.getTime() - exchange.askedAt.getTime()) / 1000;
            if (elapsedSeconds > budgetSeconds * 1.5) {
                return baseScore * 0.85;
            }
        }

        return baseScore;
    });

    const total = perExchangeScores.reduce((sum, score) => sum + score, 0);
    return Math.round(total / exchanges.length);
}

export function buildQuestionPrompt(
    role: string,
    previousExchanges: IInterviewExchange[],
    candidateContext: string
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

    const contextSection =
        candidateContext.trim().length > 0
            ? `\n\nHere is this specific candidate's real background - use it to ask at least one question that references their actual work, not just generic role questions:\n${candidateContext}`
            : "";

    return `You are conducting a mock job interview for the role of "${role || "a general position"}" on a campus placement platform.${contextSection}

Questions already asked in this session:
${history}

Ask ONE new interview question appropriate for this role, that has not already been asked above. If the candidate's real background above includes a specific project or skill relevant to this stage of the interview, prefer a question that references it directly (e.g. "Tell me about how you approached X in your <project name> project") over a generic question. Respond with ONLY the question text, no numbering, no preamble, no quotation marks.`;
}

export function buildQualityAssessmentPrompt(
    question: string,
    answer: string
): string {
    return `You are assessing the CONTENT QUALITY of a single interview answer - not its length, its actual relevance and correctness.

Question: ${question}
Answer: ${answer}

Rate how well this answer actually addresses the question, on a scale from 0 to 100. A confident but irrelevant or incorrect answer should score low even if it's long. A short but sharp, directly relevant answer should score well. Respond with ONLY a single integer from 0 to 100, nothing else - no words, no punctuation, no explanation.`;
}

/**
 * Robust on purpose: the prompt asks for "only an integer," but an
 * LLM can still wrap it in stray text despite instructions. Pulls
 * the first real number out of whatever comes back rather than
 * assuming a perfectly clean response, and clamps to the real valid
 * range so a malformed response can't produce an out-of-range score.
 */
export function parseQualityScore(raw: string): number {
    const match = raw.match(/\d+/);
    if (!match) {
        return 50;
    }

    const value = Number(match[0]);
    return Math.max(0, Math.min(100, value));
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

    return `You are a mock interview coach reviewing an interview (it may be complete, or the candidate may have stopped partway through) for the role of "${role || "a general position"}" on a campus placement platform.

Transcript:
${transcript}

A separate, deterministic system has already computed a score of ${score}/100. Do not invent a different score.

Respond with ONLY a JSON object in exactly this shape, nothing else - no markdown code fences, no preamble, no explanation outside the JSON:
{"summary": "one or two sentence overall assessment", "strengths": ["specific strength 1", "specific strength 2"], "improvements": ["specific, actionable improvement 1", "specific, actionable improvement 2"]}

strengths and improvements must each reference something specific from the actual transcript above, not generic advice. If there is genuinely nothing to praise or nothing to improve, return an empty array for that field rather than inventing filler.`;
}

/**
 * Robust on purpose, same principle as parseQualityScore: the prompt
 * asks for clean JSON, but a real LLM can still wrap it in markdown
 * fences or add stray text despite instructions. Extracts the first
 * {...} block found rather than assuming response.trim() is valid
 * JSON on its own, and falls back to a safe, honest default (empty
 * arrays, a generic summary) rather than throwing and losing the
 * whole interview result if parsing genuinely fails.
 */
export function parseFeedbackResponse(raw: string): InterviewFeedback {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
        return { summary: raw.trim().slice(0, 300) || "No feedback could be generated.", strengths: [], improvements: [] };
    }

    try {
        const parsed = JSON.parse(match[0]);
        return {
            summary: typeof parsed.summary === "string" ? parsed.summary : "",
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths.filter((s: unknown) => typeof s === "string") : [],
            improvements: Array.isArray(parsed.improvements) ? parsed.improvements.filter((s: unknown) => typeof s === "string") : [],
        };
    } catch {
        return { summary: raw.trim().slice(0, 300) || "No feedback could be generated.", strengths: [], improvements: [] };
    }
}
