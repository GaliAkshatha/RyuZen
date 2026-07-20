import { ResumeReviewInput } from "./ResumeReviewInput.js";
import { ResumeReviewResult } from "./ResumeReviewResult.js";

export interface IResumeReviewProvider {

    review(

        input: ResumeReviewInput

    ): Promise<ResumeReviewResult>;

}
