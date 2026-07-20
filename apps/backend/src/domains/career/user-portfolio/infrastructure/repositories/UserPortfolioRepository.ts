import { UserPortfolio } from "../../domain/entities/UserPortfolio.js";

import { UserPortfolioModel } from "../persistence/UserPortfolioModel.js";

import { UserPortfolioMapper } from "../mappers/UserPortfolioMapper.js";

import { IUserPortfolioRepository } from "./IUserPortfolioRepository.js";

export class UserPortfolioRepository
implements IUserPortfolioRepository {

    async findByUserId(

        userId: string

    ): Promise<UserPortfolio | null> {

        const document =

            await UserPortfolioModel.findOne({

                userId

            });

        if (!document) {

            return null;

        }

        return UserPortfolioMapper.toDomain(

            document

        );

    }

    async upsert(

        portfolio: UserPortfolio

    ): Promise<UserPortfolio> {

        const document =

            await UserPortfolioModel.findOneAndUpdate(

                {

                    userId:
                        portfolio.userId

                },

                UserPortfolioMapper.toPersistence(

                    portfolio

                ),

                {

                    new: true,

                    upsert: true,

                    setDefaultsOnInsert: true

                }

            );

        return UserPortfolioMapper.toDomain(

            document

        );

    }

}
