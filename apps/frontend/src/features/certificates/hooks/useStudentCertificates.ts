import { useApiQuery } from "@/hooks/useApiQuery";

import { certificateService } from "@/features/certificates/services/certificate.service";

export function useStudentCertificates(studentId: string) {
  return useApiQuery({
    queryKey: ["certificates", "students", studentId] as const,
    queryFn: () => certificateService.listForStudent(studentId),
    enabled: Boolean(studentId),
  });
}
