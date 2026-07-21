import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { certificationService } from "@/features/certifications/services/certification.service";
import { MY_CERTIFICATIONS_QUERY_KEY } from "@/features/certifications/hooks/useMyCertifications";
import type {
  CertificationResponseDto,
  UpdateCertificationPayload,
} from "@/features/certifications/types/certification.types";

export function useUpdateCertification(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<CertificationResponseDto, UpdateCertificationPayload>({
    mutationFn: (payload) => certificationService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: MY_CERTIFICATIONS_QUERY_KEY });
      queryClient.setQueryData(["certifications", id], updated);
    },
  });
}
