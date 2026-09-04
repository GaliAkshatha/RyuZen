import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { badgeService } from "@/domains/badges/badgeService";
import { BADGES_QUERY_KEY } from "@/domains/badges/hooks/useBadges";
import type { Badge, StudentBadge, CreateBadgeRequest, UpdateBadgeRequest, AwardBadgeRequest } from "@/domains/badges/badge.types";

export function useCreateBadge() {
  const queryClient = useQueryClient();
  return useApiMutation<Badge, CreateBadgeRequest>({
    mutationFn: (payload) => badgeService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BADGES_QUERY_KEY }),
  });
}

export function useUpdateBadge(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<Badge, UpdateBadgeRequest>({
    mutationFn: (payload) => badgeService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BADGES_QUERY_KEY }),
  });
}

export function useDeleteBadge() {
  const queryClient = useQueryClient();
  return useApiMutation<void, string>({
    mutationFn: (id) => badgeService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BADGES_QUERY_KEY }),
  });
}

/** Invalidates the specific student's award list, since that's the query the awarding UI (and the student's own badge display) actually reads from. */
export function useAwardBadge(studentId: string) {
  const queryClient = useQueryClient();
  return useApiMutation<StudentBadge, { badgeId: string; payload: AwardBadgeRequest }>({
    mutationFn: ({ badgeId, payload }) => badgeService.award(badgeId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["badges", "student", studentId] }),
  });
}
