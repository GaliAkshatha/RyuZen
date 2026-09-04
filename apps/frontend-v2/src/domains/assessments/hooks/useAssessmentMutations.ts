import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { assessmentService } from "@/domains/assessments/assessmentService";
import { ASSESSMENTS_QUERY_KEY } from "@/domains/assessments/hooks/useAssessments";
import type {
  Assessment,
  AssessmentQuestion,
  AssessmentAttempt,
  CreateAssessmentRequest,
  AddAssessmentQuestionRequest,
  RecordAssessmentAnswerRequest,
} from "@/domains/assessments/assessment.types";

export function useCreateAssessment() {
  const queryClient = useQueryClient();
  return useApiMutation<Assessment, CreateAssessmentRequest>({
    mutationFn: (payload) => assessmentService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY }),
  });
}

export function useAddAssessmentQuestion(assessmentId: string) {
  return useApiMutation<AssessmentQuestion, AddAssessmentQuestionRequest>({
    mutationFn: (payload) => assessmentService.addQuestion(assessmentId, payload),
  });
}

export function usePublishAssessment() {
  const queryClient = useQueryClient();
  return useApiMutation<Assessment, string>({
    mutationFn: (id) => assessmentService.publish(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ASSESSMENTS_QUERY_KEY }),
  });
}

export function useStartAssessmentAttempt() {
  const queryClient = useQueryClient();
  return useApiMutation<AssessmentAttempt, string>({
    mutationFn: (assessmentId) => assessmentService.startAttempt(assessmentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assessments", "attempts", "me"] }),
  });
}

export function useRecordAssessmentAnswer(attemptId: string) {
  return useApiMutation<AssessmentAttempt, RecordAssessmentAnswerRequest>({
    mutationFn: (payload) => assessmentService.recordAnswer(attemptId, payload),
  });
}

export function useSubmitAssessmentAttempt() {
  const queryClient = useQueryClient();
  return useApiMutation<AssessmentAttempt, string>({
    mutationFn: (attemptId) => assessmentService.submitAttempt(attemptId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assessments", "attempts", "me"] }),
  });
}
