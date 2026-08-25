import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { News, CreateNewsRequest } from "@/domains/news/news.types";

/** Real backend: create is FACULTY/ORG_ADMIN/PLACEMENT_ADMIN only, list excludes RECRUITER, delete requires the author or an ORG_ADMIN. */
export const newsService = {
  async list(): Promise<News[]> {
    const res = await apiClient.get<ApiSuccessResponse<News[]>>("/news");
    return res.data.data;
  },

  async create(payload: CreateNewsRequest): Promise<News> {
    const res = await apiClient.post<ApiSuccessResponse<News>>("/news", payload);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiSuccessResponse<null>>(`/news/${id}`);
  },
};
