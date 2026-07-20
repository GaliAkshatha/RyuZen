import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/hooks/useApiMutation";

import { certificationService } from "@/features/certifications/services/certification.service";
import { MY_CERTIFICATIONS_QUERY_KEY } from "@/features/certifications/hooks/useMyCertifications";

export function useDeleteCertification() {
  const queryClient = useQueryClient();

  return useApiMutation<null, string>({
    mutationFn: (id) => certificationService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_CERTIFICATIONS_QUERY_KEY });
    },
  });
}
