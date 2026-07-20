import { UserPortfolio } from "../../domain/entities/UserPortfolio.js";

export interface IUserPortfolioRepository {

    findByUserId(
        userId: string
    ): Promise<UserPortfolio | null>;

    upsert(
        portfolio: UserPortfolio
    ): Promise<UserPortfolio>;

}
