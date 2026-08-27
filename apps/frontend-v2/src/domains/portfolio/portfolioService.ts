import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  Portfolio,
  UpdatePortfolioSettingsRequest,
  PortfolioProject,
  Achievement,
  Experience,
  Education,
  Certification,
  CreatePortfolioProjectRequest,
  CreateAchievementRequest,
  CreateExperienceRequest,
  CreateEducationRequest,
  CreateCertificationRequest,
} from "@/domains/portfolio/portfolio.types";

/** Confirmed real mount: /api/v1/portfolio. Both /me routes are genuinely STUDENT-only (confirmed - the route's own comment states this was previously open to any role and got fixed). GET /:userId is genuinely open to any authenticated role (confirmed directly - the route's own comment says so), used here for recruiters/faculty viewing another user's real portfolio. */
export const portfolioService = {
  async getMine(): Promise<Portfolio> {
    const res = await apiClient.get<ApiSuccessResponse<Portfolio>>("/portfolio/me");
    return res.data.data;
  },

  async getForUser(userId: string): Promise<Portfolio> {
    const res = await apiClient.get<ApiSuccessResponse<Portfolio>>(`/portfolio/${userId}`);
    return res.data.data;
  },

  async updateSettings(payload: UpdatePortfolioSettingsRequest): Promise<Portfolio> {
    const res = await apiClient.patch<ApiSuccessResponse<Portfolio>>("/portfolio/me", payload);
    return res.data.data;
  },

  /** Real mounted paths confirmed directly in app.ts: /projects, /achievements, /experience, /education, /certifications - each STUDENT-only, each a real separate router, not nested under /portfolio. */
  async createProject(payload: CreatePortfolioProjectRequest): Promise<PortfolioProject> {
    const res = await apiClient.post<ApiSuccessResponse<PortfolioProject>>("/projects", payload);
    return res.data.data;
  },

  async createAchievement(payload: CreateAchievementRequest): Promise<Achievement> {
    const res = await apiClient.post<ApiSuccessResponse<Achievement>>("/achievements", payload);
    return res.data.data;
  },

  async createExperience(payload: CreateExperienceRequest): Promise<Experience> {
    const res = await apiClient.post<ApiSuccessResponse<Experience>>("/experience", payload);
    return res.data.data;
  },

  async createEducation(payload: CreateEducationRequest): Promise<Education> {
    const res = await apiClient.post<ApiSuccessResponse<Education>>("/education", payload);
    return res.data.data;
  },

  async createCertification(payload: CreateCertificationRequest): Promise<Certification> {
    const res = await apiClient.post<ApiSuccessResponse<Certification>>("/certifications", payload);
    return res.data.data;
  },

  /** Multipart upload - the real UploadCertificationFileUseCase endpoint, owner-only. */
  async uploadCertificationFile(certificationId: string, file: File): Promise<Certification> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<ApiSuccessResponse<Certification>>(`/certifications/${certificationId}/file`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  /** Faculty/Org Admin/Super Admin only - the real VerifyCertificationUseCase endpoint. */
  async verifyCertification(certificationId: string): Promise<Certification> {
    const res = await apiClient.patch<ApiSuccessResponse<Certification>>(`/certifications/${certificationId}/verify`);
    return res.data.data;
  },
};
