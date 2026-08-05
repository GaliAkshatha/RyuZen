import { ICareerScoreProvider } from "../../application/ports/ICareerScoreProvider.js";
import { CareerScoreInput } from "../../application/ports/CareerScoreInput.js";
import { CareerScoreInsight } from "../../application/ports/CareerScoreInsight.js";

import { GeminiClient } from "../../../../../shared/infrastructure/ai/GeminiClient.js";

import { InsightSchema, computeCareerScoreLabel, buildCareerScorePrompt } from "./careerScorePrompts.js";

/*
 Real Gemini-backed career score insight - the cloud counterpart to
 OllamaCareerScoreProvider, sharing the same deterministic label
 formula and prompt/schema (careerScorePrompts.ts).
*/

export class GeminiCareerScoreProvider implements ICareerScoreProvider {
    async generateInsight(
        input: CareerScoreInput
    ): Promise<CareerScoreInsight> {
        const label = computeCareerScoreLabel(input.careerScore);
        const prompt = buildCareerScorePrompt(input, label);

        const { narrative, recommendations, roadmap } =
            await GeminiClient.generateJson(prompt, InsightSchema);

        return { label, narrative, recommendations, roadmap };
    }
}
