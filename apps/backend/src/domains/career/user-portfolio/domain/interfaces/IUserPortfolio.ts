import { PortfolioVisibility } from "../constants/PortfolioVisibility.js";

export interface IUserPortfolio {

    id?: string;

    userId: string;

    headline?: string;

    summary?: string;

    github?: string;

    linkedin?: string;

    leetcode?: string;

    codeforces?: string;

    portfolio?: string;

    behance?: string;

    dribbble?: string;

    website?: string;

    visibility: PortfolioVisibility;

    theme?: string;

    createdAt?: Date;

    updatedAt?: Date;

}
