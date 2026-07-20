import { PortfolioVisibility } from "../../domain/constants/PortfolioVisibility.js";

import { SkillResponseDto } from "../../../skills/application/dto/SkillResponseDto.js";
import { PortfolioProjectResponseDto } from "../../../portfolio/application/dto/PortfolioProjectResponseDto.js";
import { ExperienceResponseDto } from "../../../experience/application/dto/ExperienceResponseDto.js";
import { EducationResponseDto } from "../../../education/application/dto/EducationResponseDto.js";
import { CertificationResponseDto } from "../../../certifications/application/dto/CertificationResponseDto.js";
import { AchievementResponseDto } from "../../../achievements/application/dto/AchievementResponseDto.js";

export interface UserPortfolioResponseDto {

    userId: string;

    name: string;

    email: string;

    role: string;

    profileImage?: string;

    bio?: string;

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

    skills: SkillResponseDto[];

    projects: PortfolioProjectResponseDto[];

    experience: ExperienceResponseDto[];

    education: EducationResponseDto[];

    certifications: CertificationResponseDto[];

    achievements: AchievementResponseDto[];

}
