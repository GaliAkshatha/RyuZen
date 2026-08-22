import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { mockInterviewService } from "@/domains/mock-interview/mockInterviewService";
import type { MockInterviewSession } from "@/domains/mock-interview/mockInterview.types";

export const INTERVIEW_SESSIONS_QUERY_KEY = ["mock-interview"] as const;

export function useInterviewSessions() {
  return useApiQuery<MockInterviewSession[]>({ queryKey: INTERVIEW_SESSIONS_QUERY_KEY, queryFn: mockInterviewService.list });
}
