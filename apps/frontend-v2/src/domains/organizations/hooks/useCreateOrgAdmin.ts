import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { organizationService } from "@/domains/organizations/organizationService";
import type { CreateOrgAdminRequest, CreateOrgAdminResponse } from "@/domains/organizations/organization.types";

export function useCreateOrgAdmin(organizationId: string) {
  return useApiMutation<CreateOrgAdminResponse, CreateOrgAdminRequest>({
    mutationFn: (payload) => organizationService.createOrgAdmin(organizationId, payload),
  });
}
