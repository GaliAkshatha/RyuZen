/**
 * Matches the real backend UserPortfolioResponseDto exactly.
 * Confirmed directly in GetUserPortfolioUseCase: skills are
 * pre-filtered to approved===true, achievements to
 * status===VERIFIED - both server-side, not something this frontend
 * needs to re-filter.
 */
export const PortfolioVisibility = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
} as const;
export type PortfolioVisibility = (typeof PortfolioVisibility)[keyof typeof PortfolioVisibility];

export interface Skill {
  id: string;
  userId: string;
  name: string;
  category?: string;
  level?: string;
  verified: boolean;
  approved: boolean;
}

export interface PortfolioProject {
  id: string;
  userId: string;
  title: string;
  description?: string;
  techStack: string[];
  github?: string;
  liveDemo?: string;
  featured: boolean;
}

export interface Experience {
  id: string;
  userId: string;
  company: string;
  role: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description?: string;
}

export interface Education {
  id: string;
  userId: string;
  institution: string;
  degree: string;
  branch?: string;
  cgpa?: number;
  startYear: number;
  endYear?: number;
}

export interface Certification {
  id: string;
  userId: string;
  title: string;
  issuer: string;
  credentialId?: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  fileUrl?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  category?: string;
  level?: string;
  position?: string;
  achievementDate: string;
}

export interface Portfolio {
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
  skills: Skill[];
  projects: PortfolioProject[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
}

/** Matches UpdateUserPortfolioSchema exactly - real URL format validation confirmed on every social link. */
export interface UpdatePortfolioSettingsRequest {
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

/** Matches the real backend CreatePortfolioProjectSchema exactly. */
export interface CreatePortfolioProjectRequest {
  title: string;
  description?: string;
  techStack?: string[];
  github?: string;
  liveDemo?: string;
}

/** Matches the real backend CreateAchievementSchema exactly. */
export interface CreateAchievementRequest {
  title: string;
  description?: string;
  category?: string;
  level?: "COLLEGE" | "STATE" | "NATIONAL" | "INTERNATIONAL";
  position?: string;
  achievementDate: string;
}

/** Matches the real backend CreateExperienceSchema exactly. */
export interface CreateExperienceRequest {
  company: string;
  role: string;
  employmentType?: "FULL_TIME" | "PART_TIME" | "INTERNSHIP" | "CONTRACT" | "FREELANCE";
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
}

/** Matches the real backend CreateEducationSchema exactly. */
export interface CreateEducationRequest {
  institution: string;
  degree: string;
  branch?: string;
  cgpa?: number;
  startYear: number;
  endYear?: number;
}

/** Matches the real backend CreateCertificationSchema exactly. */
export interface CreateCertificationRequest {
  title: string;
  issuer: string;
  credentialId?: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}
