import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { certificationService } from "@/features/certifications/services/certification.service";
import { MY_CERTIFICATIONS_QUERY_KEY } from "@/features/certifications/hooks/useMyCertifications";
import type {
  CertificationResponseDto,
  CreateCertificationPayload,
} from "@/features/certifications/types/certification.types";

export function useCreateCertification() {
  const queryClient = useQueryClient();

  return useApiMutation<CertificationResponseDto, CreateCertificationPayload>({
    mutationFn: certificationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_CERTIFICATIONS_QUERY_KEY });
    },
  });
}
