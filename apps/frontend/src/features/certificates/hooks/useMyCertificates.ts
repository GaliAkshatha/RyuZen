import { useApiQuery } from "@/hooks/useApiQuery";

import { certificateService } from "@/features/certificates/services/certificate.service";

export function useMyCertificates() {
  return useApiQuery({
    queryKey: ["certificates", "me"] as const,
    queryFn: certificateService.getMyCertificates,
  });
}
