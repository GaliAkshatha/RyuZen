import { PortfolioVisibility } from "../../domain/constants/PortfolioVisibility.js";

export interface UserPortfolioSettingsResponseDto {

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

}
