import { IResumeReviewProvider } from "../../application/ports/IResumeReviewProvider.js";

import { ResumeReviewInput } from "../../application/ports/ResumeReviewInput.js";
import { ResumeReviewResult } from "../../application/ports/ResumeReviewResult.js";

/*
 Placeholder resume review provider.

 No live language-model credentials exist in this environment.
 The numeric score below is a real, deterministic completeness
 heuristic (not fake) so it stays consistent with the same logic
 used by GenerateResumeUseCase (see domains/career/resume). The
 qualitative strengths/improvements/summary text is a clearly
 labelled placeholder.

 To go live: implement IResumeReviewProvider against a real
 provider (for example the Anthropic or OpenAI SDK, reading an
 API key from env.ts) and swap the binding in
 ResumeReviewContainer.ts. No other file needs to change, since
 the use case depends only on the IResumeReviewProvider port.
*/
export class StubResumeReviewProvider
implements IResumeReviewProvider {

    async review(

        input: ResumeReviewInput

    ): Promise<ResumeReviewResult> {

        const score =

            Math.min(

                100,

                input.skills.length * 5 +
                input.projectTitles.length * 10 +
                input.experienceRoles.length * 15 +
                input.educationDegrees.length * 10 +
                input.certificationTitles.length * 5

            );

        const strengths: string[] = [];

        const improvements: string[] = [];

        if (input.skills.length > 0) {

            strengths.push(

                `Lists ${input.skills.length} skill(s).`

            );

        } else {

            improvements.push(

                "Add skills to strengthen the resume."

            );

        }

        if (input.experienceRoles.length > 0) {

            strengths.push(

                `Includes ${input.experienceRoles.length} work experience entr(y/ies).`

            );

        } else {

            improvements.push(

                "Add work experience or internships, if any."

            );

        }

        if (input.projectTitles.length > 0) {

            strengths.push(

                `Showcases ${input.projectTitles.length} project(s).`

            );

        } else {

            improvements.push(

                "Add portfolio projects to demonstrate practical skills."

            );

        }

        if (input.educationDegrees.length === 0) {

            improvements.push(

                "Add education details."

            );

        }

        if (input.certificationTitles.length === 0) {

            improvements.push(

                "Consider adding relevant certifications."

            );

        }

        return {

            score,

            strengths,

            improvements,

            summary:
                "This is a placeholder review. No live language-model " +
                "provider is configured yet; the score above is a real " +
                "completeness heuristic, but this summary text is not " +
                "AI-generated."

        };

    }

}
