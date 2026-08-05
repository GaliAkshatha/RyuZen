import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type { BulkImportReportDto } from "@/features/bulk-import/types/bulk-import.types";

export const bulkImportService = {
  /**
   * Real multipart upload — axios detects FormData automatically and
   * sets the correct multipart/form-data boundary header itself; no
   * manual Content-Type needed. Matches the backend's
   * csvUpload.single("file") field name exactly.
   */
  importStudents(file: File): Promise<BulkImportReportDto> {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient
      .post<BulkImportReportDto>(`${API_ENDPOINTS.students}/bulk-import`, formData)
      .then((response) => response.data);
  },
};
