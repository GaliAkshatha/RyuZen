import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { issuedCertificateService } from "@/domains/issued-certificates/issuedCertificateService";
import type { IssuedCertificate, IssueCertificateRequest } from "@/domains/issued-certificates/issuedCertificate.types";

export function useIssueCertificate() {
  const queryClient = useQueryClient();
  return useApiMutation<IssuedCertificate, IssueCertificateRequest>({
    mutationFn: (payload) => issuedCertificateService.issue(payload),
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ["issued-certificates", "student", variables.studentId] }),
  });
}
