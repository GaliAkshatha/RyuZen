import { PortfolioVisibility } from "@/types/enums";
import type { AchievementResponseDto } from "@/features/achievements/types/achievement.types";
import type { CertificationResponseDto } from "@/features/certifications/types/certification.types";
import type { EducationResponseDto } from "@/features/education/types/education.types";
import type { ExperienceResponseDto } from "@/features/experience/types/experience.types";
import type { SkillResponseDto } from "@/features/skills/types/skill.types";

/**
 * Mirrors PortfolioProjectResponseDto exactly. Mounted at
 * /api/v1/projects (not /portfolio) — confirmed by reading app.ts's
 * route registration directly, since endpoints.ts already had this
 * correctly split into two keys. Same open-route/ownership-enforced
 * pattern as Skills/Education/Experience/Certifications (CE1-CE4):
 * `userId`-scoped, "You can only update your own portfolio
 * projects." (403) on cross-user update/delete.
 */
export interface PortfolioProjectResponseDto {
  id: string;
  userId: string;
  title: string;
  description?: string;
  techStack: string[];
  github?: string;
  liveDemo?: string;
  images: string[];
  video?: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Mirrors CreatePortfolioProjectDto */
export interface CreatePortfolioProjectPayload {
  title: string;
  description?: string;
  techStack?: string[];
  github?: string;
  liveDemo?: string;
  images?: string[];
  video?: string;
  featured?: boolean;
}

/** Mirrors UpdatePortfolioProjectDto — every field optional */
export interface UpdatePortfolioProjectPayload {
  title?: string;
  description?: string;
  techStack?: string[];
  github?: string;
  liveDemo?: string;
  images?: string[];
  video?: string;
  featured?: boolean;
}

/**
 * Mirrors UserPortfolioResponseDto exactly — the full aggregated
 * "public portfolio page" view, genuinely combining CE1 (skills), CE2
 * (education), CE3 (experience), CE4 (certifications), CE5
 * (achievements), and this milestone's projects into ONE response.
 * Returned by GET /portfolio/me and GET /portfolio/:userId.
 *
 * GET /:userId has a real, confirmed visibility gate: if the target's
 * portfolio.visibility is PRIVATE, only the owner or a viewer with
 * role SUPER_ADMIN/ORG_ADMIN (NOT FACULTY — checked exactly, confirmed
 * this milestone) can view it; anyone else gets 403 "This portfolio is
 * private."
 */
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

/** Mirrors UserPortfolioSettingsResponseDto — the lighter shape PATCH /me actually returns, not the full aggregate */
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

/** Mirrors UpdateUserPortfolioDto — every field optional */
export interface UpdateUserPortfolioPayload {
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
  visibility?: PortfolioVisibility;
  theme?: string;
}
