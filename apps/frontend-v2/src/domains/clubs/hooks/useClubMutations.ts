import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { clubService } from "@/domains/clubs/clubService";
import { CLUBS_QUERY_KEY } from "@/domains/clubs/hooks/useClubs";
import type {
  Club,
  ClubMember,
  CreateClubRequest,
  UpdateClubRequest,
  AssignAdvisorRequest,
  AddClubMemberRequest,
} from "@/domains/clubs/club.types";

export function useCreateClub() {
  const queryClient = useQueryClient();
  return useApiMutation<Club, CreateClubRequest>({
    mutationFn: (payload) => clubService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLUBS_QUERY_KEY }),
  });
}

export function useUpdateClub(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<Club, UpdateClubRequest>({
    mutationFn: (payload) => clubService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLUBS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["clubs", id] });
    },
  });
}

export function useDeleteClub() {
  const queryClient = useQueryClient();
  return useApiMutation<void, string>({
    mutationFn: (id) => clubService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLUBS_QUERY_KEY }),
  });
}

export function useAssignAdvisor(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<Club, AssignAdvisorRequest>({
    mutationFn: (payload) => clubService.assignAdvisor(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLUBS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["clubs", id] });
    },
  });
}

export function useAddClubMember(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<ClubMember, AddClubMemberRequest>({
    mutationFn: (payload) => clubService.addMember(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clubs", id, "members"] }),
  });
}

export function useRemoveClubMember(id: string) {
  const queryClient = useQueryClient();
  return useApiMutation<void, string>({
    mutationFn: (memberId) => clubService.removeMember(id, memberId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clubs", id, "members"] }),
  });
}
