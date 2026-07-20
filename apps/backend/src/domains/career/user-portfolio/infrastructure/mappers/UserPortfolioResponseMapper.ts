import { UserPortfolio } from "../../domain/entities/UserPortfolio.js";

import { UserPortfolioSettingsResponseDto } from "../../application/dto/UserPortfolioSettingsResponseDto.js";

export class UserPortfolioResponseMapper {

    static toDto(

        portfolio: UserPortfolio

    ): UserPortfolioSettingsResponseDto {

        return {

            userId:
                portfolio.userId,

            headline:
                portfolio.headline,

            summary:
                portfolio.summary,

            github:
                portfolio.github,

            linkedin:
                portfolio.linkedin,

            leetcode:
                portfolio.leetcode,

            codeforces:
                portfolio.codeforces,

            portfolio:
                portfolio.portfolio,

            behance:
                portfolio.behance,

            dribbble:
                portfolio.dribbble,

            website:
                portfolio.website,

            visibility:
                portfolio.visibility,

            theme:
                portfolio.theme

        };

    }

}
