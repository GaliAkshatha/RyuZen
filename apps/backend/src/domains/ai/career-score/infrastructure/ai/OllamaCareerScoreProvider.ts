import { ICareerScoreProvider } from "../../application/ports/ICareerScoreProvider.js";
import { CareerScoreInput } from "../../application/ports/CareerScoreInput.js";
import { CareerScoreInsight } from "../../application/ports/CareerScoreInsight.js";

import { OllamaClient } from "../../../../../shared/infrastructure/ai/OllamaClient.js";

import { InsightSchema, computeCareerScoreLabel, buildCareerScorePrompt } from "./careerScorePrompts.js";

/*
 Real Ollama-backed career score insight. Every numeric score is
 computed deterministically in GetCareerScoreUseCase and never touched
 here - only the narrative/recommendations/roadmap are AI-generated,
 using logic shared with GeminiCareerScoreProvider via careerScorePrompts.ts.
*/

export class OllamaCareerScoreProvider implements ICareerScoreProvider {
    async generateInsight(
        input: CareerScoreInput
    ): Promise<CareerScoreInsight> {
        const label = computeCareerScoreLabel(input.careerScore);
        const prompt = buildCareerScorePrompt(input, label);

        const { narrative, recommendations, roadmap } =
            await OllamaClient.generateJson(prompt, InsightSchema);

        return { label, narrative, recommendations, roadmap };
    }
}
