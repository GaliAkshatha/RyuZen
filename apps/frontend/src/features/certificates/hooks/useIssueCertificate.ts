import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { certificateService } from "@/features/certificates/services/certificate.service";
import type {
  CertificateResponseDto,
  IssueCertificatePayload,
} from "@/features/certificates/types/certificate.types";

export function useIssueCertificate(studentId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<CertificateResponseDto, IssueCertificatePayload>({
    mutationFn: certificateService.issue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates", "students", studentId] });
    },
  });
}
