import { IRecommendationProvider } from "../../application/ports/IRecommendationProvider.js";

import { RecommendationCandidate } from "../../application/ports/RecommendationCandidate.js";
import { RecommendationItem } from "../../application/ports/RecommendationItem.js";

import { RecommendationType } from "../../domain/constants/RecommendationType.js";

/*
 Placeholder recommendation provider.

 No live language-model credentials exist in this environment.
 The candidates themselves (which activities/events/clubs to
 suggest) are computed for real by GetRecommendationsUseCase,
 filtered against the caller's actual submissions, event
 registrations, and club memberships. This adapter only attaches
 a clearly-labelled placeholder "reason" string per item.

 To go live: implement IRecommendationProvider against a real
 provider (for example the Anthropic or OpenAI SDK, reading an
 API key from env.ts) and swap the binding in
 RecommendationsContainer.ts. No other file needs to change,
 since the use case depends only on the IRecommendationProvider
 port.
*/
export class StubRecommendationProvider
implements IRecommendationProvider {

    async annotate(

        candidates: RecommendationCandidate[]

    ): Promise<RecommendationItem[]> {

        return candidates.map(

            candidate => ({

                type:
                    candidate.type,

                id:
                    candidate.id,

                title:
                    candidate.title,

                reason:
                    this.placeholderReason(
                        candidate.type
                    )

            })

        );

    }

    private placeholderReason(

        type: RecommendationType

    ): string {

        switch (type) {

            case RecommendationType.ACTIVITY:

                return "This is a placeholder reason. You have not " +
                    "submitted this activity yet.";

            case RecommendationType.EVENT:

                return "This is a placeholder reason. You have not " +
                    "registered for this event yet.";

            case RecommendationType.CLUB:

                return "This is a placeholder reason. You have not " +
                    "joined this club yet.";

            default:

                return "This is a placeholder reason.";

        }

    }

}
