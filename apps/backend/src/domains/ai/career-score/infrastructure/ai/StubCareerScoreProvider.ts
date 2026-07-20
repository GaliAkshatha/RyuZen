import { ICareerScoreProvider } from "../../application/ports/ICareerScoreProvider.js";

import { CareerScoreInput } from "../../application/ports/CareerScoreInput.js";
import { CareerScoreInsight } from "../../application/ports/CareerScoreInsight.js";

/*
 Placeholder career score provider.

 No live language-model credentials exist in this environment.
 The label below is derived from the deterministic numeric score
 computed in GetCareerScoreUseCase (not fake), but the narrative
 text is a clearly labelled placeholder.

 To go live: implement ICareerScoreProvider against a real
 provider (for example the Anthropic or OpenAI SDK, reading an
 API key from env.ts) and swap the binding in
 CareerScoreContainer.ts. No other file needs to change, since
 the use case depends only on the ICareerScoreProvider port.
*/
export class StubCareerScoreProvider
implements ICareerScoreProvider {

    async generateInsight(

        input: CareerScoreInput

    ): Promise<CareerScoreInsight> {

        let label: string;

        if (input.careerScore >= 80) {

            label = "Excellent";

        } else if (input.careerScore >= 60) {

            label = "Strong Profile";

        } else if (input.careerScore >= 35) {

            label = "Building Momentum";

        } else {

            label = "Getting Started";

        }

        return {

            label,

            narrative:
                "This is a placeholder insight. No live language-model " +
                "provider is configured yet; the score and label above " +
                "are computed deterministically, but this narrative " +
                "text is not AI-generated."

        };

    }

}
