import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type {
  AlumniRecord,
  CreateAlumniRequest,
  InviteAlumniRequest,
  UpdateAlumniRequest,
  ConvertStudentToAlumniRequest,
} from "@/domains/alumni-management/alumniManagement.types";

/** SUPER_ADMIN/ORG_ADMIN for every call except getMe, which is ALUMNI-only self-view (verify/convert are ORG_ADMIN only). */
export const alumniManagementService = {
  async getMe(): Promise<AlumniRecord> {
    const res = await apiClient.get<ApiSuccessResponse<AlumniRecord>>("/alumni/me");
    return res.data.data;
  },
  async list(): Promise<AlumniRecord[]> {
    const res = await apiClient.get<ApiSuccessResponse<AlumniRecord[]>>("/alumni");
    return res.data.data;
  },
  async getById(id: string): Promise<AlumniRecord> {
    const res = await apiClient.get<ApiSuccessResponse<AlumniRecord>>(`/alumni/${id}`);
    return res.data.data;
  },
  async create(payload: CreateAlumniRequest): Promise<AlumniRecord> {
    const res = await apiClient.post<ApiSuccessResponse<AlumniRecord>>("/alumni", payload);
    return res.data.data;
  },
  async invite(payload: InviteAlumniRequest): Promise<AlumniRecord> {
    const res = await apiClient.post<ApiSuccessResponse<AlumniRecord>>("/alumni/invite", payload);
    return res.data.data;
  },
  async update(id: string, payload: UpdateAlumniRequest): Promise<AlumniRecord> {
    const res = await apiClient.patch<ApiSuccessResponse<AlumniRecord>>(`/alumni/${id}`, payload);
    return res.data.data;
  },
  async verify(id: string): Promise<AlumniRecord> {
    const res = await apiClient.patch<ApiSuccessResponse<AlumniRecord>>(`/alumni/${id}/verify`);
    return res.data.data;
  },
  async convertStudent(studentId: string, payload: ConvertStudentToAlumniRequest): Promise<AlumniRecord> {
    const res = await apiClient.post<ApiSuccessResponse<AlumniRecord>>(`/alumni/convert/${studentId}`, payload);
    return res.data.data;
  },
};
