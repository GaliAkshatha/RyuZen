export interface AiProviderStatusResponseDto {

    provider: "gemini" | "ollama";

    displayName: string;

    mode: "cloud" | "local";

}
