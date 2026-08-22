import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { mentorshipService } from "@/domains/mentorship/mentorshipService";
import type { Mentorship } from "@/domains/mentorship/mentorship.types";

export const MENTORSHIPS_QUERY_KEY = ["mentorships"] as const;

export function useMyMentorships() {
  return useApiQuery<Mentorship[]>({ queryKey: MENTORSHIPS_QUERY_KEY, queryFn: mentorshipService.listMine });
}
