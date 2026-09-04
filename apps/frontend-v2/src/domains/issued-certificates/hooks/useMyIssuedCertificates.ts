import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { issuedCertificateService } from "@/domains/issued-certificates/issuedCertificateService";
import type { IssuedCertificate } from "@/domains/issued-certificates/issuedCertificate.types";

export function useMyIssuedCertificates() {
  return useApiQuery<IssuedCertificate[]>({
    queryKey: ["issued-certificates", "me"] as const,
    queryFn: issuedCertificateService.getMine,
  });
}
