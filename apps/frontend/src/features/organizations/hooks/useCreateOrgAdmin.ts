import { useApiMutation } from "@/hooks/useApiMutation";

import { organizationService } from "@/features/organizations/services/organization.service";
import type {
  CreateOrgAdminPayload,
  CreateOrgAdminResponseDto,
} from "@/features/organizations/types/organization.types";

export function useCreateOrgAdmin(organizationId: string) {
  return useApiMutation<CreateOrgAdminResponseDto, CreateOrgAdminPayload>({
    mutationFn: (payload) => organizationService.createOrgAdmin(organizationId, payload),
  });
}
