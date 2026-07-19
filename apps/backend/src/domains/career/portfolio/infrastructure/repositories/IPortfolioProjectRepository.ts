import { PortfolioProject } from "../../domain/entities/PortfolioProject.js";

export interface IPortfolioProjectRepository {

    create(
        project: PortfolioProject
    ): Promise<PortfolioProject>;

    findById(
        id: string
    ): Promise<PortfolioProject | null>;

    findByUserId(
        userId: string
    ): Promise<PortfolioProject[]>;

    save(
        project: PortfolioProject
    ): Promise<PortfolioProject>;

    delete(
        id: string
    ): Promise<void>;

}
