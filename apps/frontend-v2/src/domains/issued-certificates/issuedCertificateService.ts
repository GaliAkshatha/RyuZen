import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { IssuedCertificate, IssueCertificateRequest } from "@/domains/issued-certificates/issuedCertificate.types";

/** Real gap filled: /certificates (campus/certificates - distinct from career/certifications) existed on the backend with zero frontend caller. Issue is SUPER_ADMIN/ORG_ADMIN/FACULTY; me is STUDENT self-scoped; listForStudent/getById are admin/faculty. */
export const issuedCertificateService = {
  async issue(payload: IssueCertificateRequest): Promise<IssuedCertificate> {
    const res = await apiClient.post<ApiSuccessResponse<IssuedCertificate>>("/certificates", payload);
    return res.data.data;
  },

  async getMine(): Promise<IssuedCertificate[]> {
    const res = await apiClient.get<ApiSuccessResponse<IssuedCertificate[]>>("/certificates/me");
    return res.data.data;
  },

  async listForStudent(studentId: string): Promise<IssuedCertificate[]> {
    const res = await apiClient.get<ApiSuccessResponse<IssuedCertificate[]>>(`/certificates/students/${studentId}`);
    return res.data.data;
  },
};
