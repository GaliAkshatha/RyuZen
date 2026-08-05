import { ISkillExtractionProvider } from "../../application/ports/ISkillExtractionProvider.js";
import { SkillExtractionInput } from "../../application/ports/SkillExtractionInput.js";
import { SkillSuggestion } from "../../application/ports/SkillSuggestion.js";

import { GeminiClient } from "../../../../../shared/infrastructure/ai/GeminiClient.js";

import { SuggestionsSchema, hasAnyEvidence, buildSkillExtractionPrompt } from "./skillExtractionPrompts.js";

/*
 Real Gemini-backed skill extraction - the cloud counterpart to
 OllamaSkillExtractionProvider, sharing prompt/schema/evidence check
 via skillExtractionPrompts.ts.
*/

export class GeminiSkillExtractionProvider implements ISkillExtractionProvider {
    async extract(
        input: SkillExtractionInput
    ): Promise<SkillSuggestion[]> {
        if (!hasAnyEvidence(input)) {
            return [];
        }

        const prompt = buildSkillExtractionPrompt(input);
        const { skills } = await GeminiClient.generateJson(prompt, SuggestionsSchema);
        return skills;
    }
}
