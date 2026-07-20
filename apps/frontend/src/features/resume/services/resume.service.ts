import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  CreateResumeTemplatePayload,
  GenerateResumePayload,
  ResumeResponseDto,
  ResumeTemplateResponseDto,
  UpdateResumeTemplatePayload,
  UpdateResumeVisibilityPayload,
} from "@/features/resume/types/resume.types";

export const resumeService = {
  getMine(): Promise<ResumeResponseDto> {
    return apiClient.get<ResumeResponseDto>(API_ENDPOINTS.resume).then((response) => response.data);
  },

  updateVisibility(payload: UpdateResumeVisibilityPayload): Promise<ResumeResponseDto> {
    return apiClient
      .patch<ResumeResponseDto>(API_ENDPOINTS.resume, payload)
      .then((response) => response.data);
  },

  generate(payload: GenerateResumePayload): Promise<ResumeResponseDto> {
    return apiClient
      .post<ResumeResponseDto>(`${API_ENDPOINTS.resume}/generate`, payload)
      .then((response) => response.data);
  },

  /** Returns the same ResumeResponseDto shape — this endpoint doesn't stream a file, it confirms resumeUrl exists for the client to open. */
  download(): Promise<ResumeResponseDto> {
    return apiClient
      .get<ResumeResponseDto>(`${API_ENDPOINTS.resume}/download`)
      .then((response) => response.data);
  },

  listTemplates(): Promise<ResumeTemplateResponseDto[]> {
    return apiClient
      .get<ResumeTemplateResponseDto[]>(`${API_ENDPOINTS.resume}/templates`)
      .then((response) => response.data);
  },

  getTemplateById(id: string): Promise<ResumeTemplateResponseDto> {
    return apiClient
      .get<ResumeTemplateResponseDto>(`${API_ENDPOINTS.resume}/templates/${id}`)
      .then((response) => response.data);
  },

  createTemplate(payload: CreateResumeTemplatePayload): Promise<ResumeTemplateResponseDto> {
    return apiClient
      .post<ResumeTemplateResponseDto>(`${API_ENDPOINTS.resume}/templates`, payload)
      .then((response) => response.data);
  },

  updateTemplate(
    id: string,
    payload: UpdateResumeTemplatePayload,
  ): Promise<ResumeTemplateResponseDto> {
    return apiClient
      .patch<ResumeTemplateResponseDto>(`${API_ENDPOINTS.resume}/templates/${id}`, payload)
      .then((response) => response.data);
  },

  removeTemplate(id: string): Promise<null> {
    return apiClient
      .delete<null>(`${API_ENDPOINTS.resume}/templates/${id}`)
      .then((response) => response.data);
  },
};
