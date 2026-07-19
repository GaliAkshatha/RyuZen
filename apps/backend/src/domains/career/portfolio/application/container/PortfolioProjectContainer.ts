import { PortfolioProjectRepository } from "../../infrastructure/repositories/PortfolioProjectRepository.js";

import { CreatePortfolioProjectUseCase } from "../use-cases/CreatePortfolioProjectUseCase.js";
import { GetPortfolioProjectUseCase } from "../use-cases/GetPortfolioProjectUseCase.js";
import { GetPortfolioProjectsByUserUseCase } from "../use-cases/GetPortfolioProjectsByUserUseCase.js";
import { UpdatePortfolioProjectUseCase } from "../use-cases/UpdatePortfolioProjectUseCase.js";
import { DeletePortfolioProjectUseCase } from "../use-cases/DeletePortfolioProjectUseCase.js";

const portfolioProjectRepository = new PortfolioProjectRepository();

export const portfolioProjectContainer = {

    createPortfolioProject:

        new CreatePortfolioProjectUseCase(
            portfolioProjectRepository
        ),

    getPortfolioProject:

        new GetPortfolioProjectUseCase(
            portfolioProjectRepository
        ),

    getPortfolioProjectsByUser:

        new GetPortfolioProjectsByUserUseCase(
            portfolioProjectRepository
        ),

    updatePortfolioProject:

        new UpdatePortfolioProjectUseCase(
            portfolioProjectRepository
        ),

    deletePortfolioProject:

        new DeletePortfolioProjectUseCase(
            portfolioProjectRepository
        )

};
