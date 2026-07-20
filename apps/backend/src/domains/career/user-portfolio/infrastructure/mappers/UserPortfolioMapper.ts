import { UserPortfolio } from "../../domain/entities/UserPortfolio.js";

import { PortfolioVisibility } from "../../domain/constants/PortfolioVisibility.js";

import {
    UserPortfolioDocument
} from "../persistence/UserPortfolioModel.js";

export class UserPortfolioMapper {

    static toDomain(

        document: UserPortfolioDocument

    ): UserPortfolio {

        return UserPortfolio.create({

            id:
                document.id,

            userId:
                document.userId.toString(),

            headline:
                document.headline,

            summary:
                document.summary,

            github:
                document.github,

            linkedin:
                document.linkedin,

            leetcode:
                document.leetcode,

            codeforces:
                document.codeforces,

            portfolio:
                document.portfolio,

            behance:
                document.behance,

            dribbble:
                document.dribbble,

            website:
                document.website,

            visibility:
                document.visibility as PortfolioVisibility,

            theme:
                document.theme,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        portfolio: UserPortfolio

    ) {

        const data =
            portfolio.toObject();

        return {

            userId:
                data.userId,

            headline:
                data.headline,

            summary:
                data.summary,

            github:
                data.github,

            linkedin:
                data.linkedin,

            leetcode:
                data.leetcode,

            codeforces:
                data.codeforces,

            portfolio:
                data.portfolio,

            behance:
                data.behance,

            dribbble:
                data.dribbble,

            website:
                data.website,

            visibility:
                data.visibility,

            theme:
                data.theme

        };

    }

}
