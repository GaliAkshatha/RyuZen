import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { Company, CreateCompanyRequest } from "@/domains/companies/company.types";

/** GET is open to any authenticated user; POST is confirmed ORG_ADMIN/PLACEMENT_ADMIN only. */
export const companyService = {
  async list(): Promise<Company[]> {
    const res = await apiClient.get<ApiSuccessResponse<Company[]>>("/companies");
    return res.data.data;
  },

  async create(payload: CreateCompanyRequest): Promise<Company> {
    const res = await apiClient.post<ApiSuccessResponse<Company>>("/companies", payload);
    return res.data.data;
  },
};
