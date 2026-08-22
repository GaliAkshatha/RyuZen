import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { recruiterService } from "@/domains/recruiters/recruiterService";
import type { RecruiterProfile } from "@/domains/recruiters/recruiter.types";

export function useMyRecruiterProfile() {
  return useApiQuery<RecruiterProfile>({
    queryKey: ["recruiters", "me", "profile"] as const,
    queryFn: recruiterService.getMyProfile,
  });
}
