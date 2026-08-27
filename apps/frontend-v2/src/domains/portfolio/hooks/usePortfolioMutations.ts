import { useQueryClient } from "@tanstack/react-query";

import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { portfolioService } from "@/domains/portfolio/portfolioService";
import { PORTFOLIO_QUERY_KEY } from "@/domains/portfolio/hooks/usePortfolio";
import type {
  PortfolioProject,
  Achievement,
  Experience,
  Education,
  Certification,
  CreatePortfolioProjectRequest,
  CreateAchievementRequest,
  CreateExperienceRequest,
  CreateEducationRequest,
  CreateCertificationRequest,
} from "@/domains/portfolio/portfolio.types";

/**
 * Five real create-mutation hooks filling a confirmed gap: the
 * aggregate portfolio view displayed these five sections read-only,
 * with no way to add an entry to any of them from the frontend at
 * all - only Skills had real add functionality (SkillsManager).
 * Every mutation invalidates the same aggregate PORTFOLIO_QUERY_KEY,
 * since that's the one query every section of PortfolioPage actually
 * reads from - a new project/achievement/etc. needs that cache
 * refetched to actually appear.
 */
export function useCreateProject() {
  const queryClient = useQueryClient();
  return useApiMutation<PortfolioProject, CreatePortfolioProjectRequest>({
    mutationFn: (payload) => portfolioService.createProject(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY }),
  });
}

export function useCreateAchievement() {
  const queryClient = useQueryClient();
  return useApiMutation<Achievement, CreateAchievementRequest>({
    mutationFn: (payload) => portfolioService.createAchievement(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY }),
  });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useApiMutation<Experience, CreateExperienceRequest>({
    mutationFn: (payload) => portfolioService.createExperience(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY }),
  });
}

export function useCreateEducation() {
  const queryClient = useQueryClient();
  return useApiMutation<Education, CreateEducationRequest>({
    mutationFn: (payload) => portfolioService.createEducation(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY }),
  });
}

export function useCreateCertification() {
  const queryClient = useQueryClient();
  return useApiMutation<Certification, CreateCertificationRequest>({
    mutationFn: (payload) => portfolioService.createCertification(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY }),
  });
}

export function useUploadCertificationFile() {
  const queryClient = useQueryClient();
  return useApiMutation<Certification, { certificationId: string; file: File }>({
    mutationFn: ({ certificationId, file }) => portfolioService.uploadCertificationFile(certificationId, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY }),
  });
}

/** Called by Faculty/Org Admin viewing a STUDENT's portfolio - invalidates the shared "portfolio" key prefix, covering both ["portfolio","me"] and ["portfolio","user",userId] shapes. */
export function useVerifyCertification() {
  const queryClient = useQueryClient();
  return useApiMutation<Certification, string>({
    mutationFn: (certificationId) => portfolioService.verifyCertification(certificationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["portfolio"] }),
  });
}
