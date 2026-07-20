import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  CreatePortfolioProjectPayload,
  PortfolioProjectResponseDto,
  UpdatePortfolioProjectPayload,
} from "@/features/portfolio/types/portfolio.types";

export const portfolioProjectService = {
  /** Implicitly scoped to the caller's own projects. */
  listMine(): Promise<PortfolioProjectResponseDto[]> {
    return apiClient
      .get<PortfolioProjectResponseDto[]>(API_ENDPOINTS.projects)
      .then((response) => response.data);
  },

  listForUser(userId: string): Promise<PortfolioProjectResponseDto[]> {
    return apiClient
      .get<PortfolioProjectResponseDto[]>(`${API_ENDPOINTS.projects}/users/${userId}`)
      .then((response) => response.data);
  },

  getById(id: string): Promise<PortfolioProjectResponseDto> {
    return apiClient
      .get<PortfolioProjectResponseDto>(`${API_ENDPOINTS.projects}/${id}`)
      .then((response) => response.data);
  },

  create(payload: CreatePortfolioProjectPayload): Promise<PortfolioProjectResponseDto> {
    return apiClient
      .post<PortfolioProjectResponseDto>(API_ENDPOINTS.projects, payload)
      .then((response) => response.data);
  },

  update(id: string, payload: UpdatePortfolioProjectPayload): Promise<PortfolioProjectResponseDto> {
    return apiClient
      .patch<PortfolioProjectResponseDto>(`${API_ENDPOINTS.projects}/${id}`, payload)
      .then((response) => response.data);
  },

  remove(id: string): Promise<null> {
    return apiClient
      .delete<null>(`${API_ENDPOINTS.projects}/${id}`)
      .then((response) => response.data);
  },
};
