import { ISkillExtractionProvider } from "../../application/ports/ISkillExtractionProvider.js";
import { SkillExtractionInput } from "../../application/ports/SkillExtractionInput.js";
import { SkillSuggestion } from "../../application/ports/SkillSuggestion.js";

import { OllamaClient } from "../../../../../shared/infrastructure/ai/OllamaClient.js";

import { SuggestionsSchema, hasAnyEvidence, buildSkillExtractionPrompt } from "./skillExtractionPrompts.js";

/*
 Real Ollama-backed skill extraction, sharing prompt/schema/evidence
 check with GeminiSkillExtractionProvider via skillExtractionPrompts.ts.
*/

export class OllamaSkillExtractionProvider implements ISkillExtractionProvider {
    async extract(
        input: SkillExtractionInput
    ): Promise<SkillSuggestion[]> {
        if (!hasAnyEvidence(input)) {
            return [];
        }

        const prompt = buildSkillExtractionPrompt(input);
        const { skills } = await OllamaClient.generateJson(prompt, SuggestionsSchema);
        return skills;
    }
}
