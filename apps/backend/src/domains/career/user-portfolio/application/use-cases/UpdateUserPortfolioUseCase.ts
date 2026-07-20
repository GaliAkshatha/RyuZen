import { UserPortfolio } from "../../domain/entities/UserPortfolio.js";

import { PortfolioVisibility } from "../../domain/constants/PortfolioVisibility.js";

import { IUserPortfolioRepository } from "../../infrastructure/repositories/IUserPortfolioRepository.js";

import { UserPortfolioResponseMapper } from "../../infrastructure/mappers/UserPortfolioResponseMapper.js";

import { UpdateUserPortfolioDto } from "../dto/UpdateUserPortfolioDto.js";
import { UserPortfolioSettingsResponseDto } from "../dto/UserPortfolioSettingsResponseDto.js";

export class UpdateUserPortfolioUseCase {

    constructor(

        private readonly repository: IUserPortfolioRepository

    ) {}

    async execute(

        userId: string,

        dto: UpdateUserPortfolioDto

    ): Promise<UserPortfolioSettingsResponseDto> {

        let portfolio =

            await this.repository.findByUserId(
                userId
            );

        if (!portfolio) {

            portfolio = UserPortfolio.create({

                userId,

                visibility:
                    PortfolioVisibility.PUBLIC

            });

        }

        portfolio.updateDetails(dto);

        const updated =

            await this.repository.upsert(

                portfolio

            );

        return UserPortfolioResponseMapper.toDto(

            updated

        );

    }

}
