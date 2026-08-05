const SYSTEM_PROMPT =
    "You are RyuZen's AI assistant, helping students on a campus " +
    "activity, career, and placement platform. Be concise, encouraging, " +
    "and specific. If asked about something outside campus life, " +
    "career development, or the platform itself, gently redirect the " +
    "conversation back to how you can help with those topics.";

/**
 * Shared across OllamaAIProvider and GeminiAIProvider so both
 * providers give the exact same instructions - a difference here
 * would mean the assistant's behavior changes depending on which
 * provider happens to be configured, which the rest of the app must
 * stay completely unaware of.
 */
export function buildChatSystemPrompt(context?: string): string {
    return context
        ? `${SYSTEM_PROMPT} The current conversation topic is: "${context}".`
        : SYSTEM_PROMPT;
}
