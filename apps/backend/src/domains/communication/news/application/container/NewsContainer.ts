import { NewsRepository } from "../../infrastructure/repositories/NewsRepository.js";

import { UserRepository } from "../../../../identity/infrastructure/repositories/UserRepository.js";

import { CreateNewsUseCase } from "../use-cases/CreateNewsUseCase.js";
import { GetOrgNewsUseCase } from "../use-cases/GetOrgNewsUseCase.js";
import { DeleteNewsUseCase } from "../use-cases/DeleteNewsUseCase.js";

const newsRepository = new NewsRepository();

const userRepository = new UserRepository();

export const newsContainer = {

    createNews:

        new CreateNewsUseCase(
            newsRepository,
            userRepository
        ),

    getOrgNews:

        new GetOrgNewsUseCase(
            newsRepository
        ),

    deleteNews:

        new DeleteNewsUseCase(
            newsRepository
        )

};
