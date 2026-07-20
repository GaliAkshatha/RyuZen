import { useApiQuery } from "@/hooks/useApiQuery";

import { certificationService } from "@/features/certifications/services/certification.service";

export const MY_CERTIFICATIONS_QUERY_KEY = ["certifications", "mine"] as const;

export function useMyCertifications() {
  return useApiQuery({
    queryKey: MY_CERTIFICATIONS_QUERY_KEY,
    queryFn: certificationService.listMine,
  });
}
