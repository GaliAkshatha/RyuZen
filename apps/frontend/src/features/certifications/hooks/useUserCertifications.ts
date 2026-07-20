import { useApiQuery } from "@/hooks/useApiQuery";

import { certificationService } from "@/features/certifications/services/certification.service";

export function useUserCertifications(userId: string) {
  return useApiQuery({
    queryKey: ["certifications", "users", userId] as const,
    queryFn: () => certificationService.listForUser(userId),
    enabled: Boolean(userId),
  });
}
