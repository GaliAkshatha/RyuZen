import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Code2, FolderGit2, Trophy, FileText, Sparkles, Briefcase, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { Skeleton } from "@/shared/components/Skeleton";
import { ScoreRing } from "@/shared/components/ScoreRing";
import { InterviewRoundsPanel } from "@/domains/interview-rounds/components/InterviewRoundsPanel";
import { StatusUpdateActions } from "@/domains/job-applications/components/StatusUpdateActions";
import { usePortfolioForUser } from "@/domains/portfolio/hooks/usePortfolioForUser";
import { useCareerScoreForCandidate } from "@/domains/career-score/hooks/useCareerScoreForCandidate";
import { useResumeForCandidate } from "@/domains/resume/hooks/useResumeForCandidate";
import { useMockInterviewsForCandidate } from "@/domains/mock-interview/hooks/useMockInterviewsForCandidate";
import type { JobApplication } from "@/domains/job-applications/jobApplication.types";

/**
 * The real candidate profile - "the important part of our project."
 * Reached only via router state carrying the full, already-fetched
 * JobApplication (from useMyApplicants/useSearchApplicants, both
 * already enriched with studentName/studentUsn/studentUserId) - not a
 * fresh fetch-by-id, since GET /applications/:id is confirmed
 * genuinely broken for RECRUITER (its ownership check only recognizes
 * admins or the applicant themselves). A direct visit or refresh with
 * no state shows a real, calm redirect prompt rather than a crash.
 */
export function CandidateProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const applicant = location.state?.applicant as JobApplication | undefined;
  const userId = applicant?.studentUserId ?? "";

  const { data: portfolio, isLoading: loadingPortfolio } = usePortfolioForUser(userId);
  const { data: careerScore, isLoading: loadingScore } = useCareerScoreForCandidate(userId);
  const { data: resume, isError: resumeError } = useResumeForCandidate(userId);
  const { data: interviews } = useMockInterviewsForCandidate(userId);

  if (!applicant || !applicant.studentUserId) {
    return (
      <div className="flex flex-col gap-4">
        <EmptyState
          icon={Briefcase}
          title="No candidate selected"
          description="Open a candidate from your Applicants list to see their real profile."
        />
        <Button size="sm" variant="outline" className="w-fit" onClick={() => navigate("/recruiter/applicants")}>
          Go to Applicants
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" className="w-fit flex items-center gap-1.5 text-muted-foreground" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back
      </Button>

      <Card>
        <CardContent className="flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
              {(applicant.studentName ?? "?").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{applicant.studentName ?? "Unknown candidate"}</h1>
              <p className="text-sm text-muted-foreground">{applicant.studentUsn}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={applicant.status} />
            <StatusUpdateActions applicationId={applicant.id} placementId={applicant.placementId} currentStatus={applicant.status} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Career Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-1 py-2">
              {loadingScore ? (
                <Skeleton className="h-28 w-28 rounded-full" />
              ) : careerScore ? (
                <>
                  <ScoreRing value={careerScore.careerScore} size={120} />
                  <p className="mt-1 text-xs text-muted-foreground">{careerScore.label}</p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Not available yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Real signals</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  Resume
                </span>
                {resumeError ? (
                  <span className="text-xs text-muted-foreground">Not generated</span>
                ) : resume?.resumeUrl ? (
                  <a href={resume.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                    View <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  AI Mock Interviews
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {interviews ? `${interviews.length} taken` : "—"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Application</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Applied</span>
                <span className="text-foreground">{new Date(applicant.appliedAt).toLocaleDateString()}</span>
              </div>
              {applicant.remarks && (
                <div>
                  <p className="text-xs text-muted-foreground">Remarks</p>
                  <p className="text-foreground">{applicant.remarks}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          {loadingPortfolio ? (
            <Skeleton className="h-40 w-full" />
          ) : !portfolio ? (
            <ErrorState error={null} onRetry={() => {}} />
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-success" aria-hidden="true" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolio.skills.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No skills listed.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {portfolio.skills.map((skill) => (
                        <span key={skill.id} className="rounded-lg border border-success/30 bg-success/10 px-3 py-1.5 text-sm font-medium text-success">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderGit2 className="h-4 w-4 text-primary" aria-hidden="true" />
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolio.projects.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No projects listed.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {portfolio.projects.map((project) => (
                        <div key={project.id} className="rounded-lg border border-border p-3">
                          <p className="font-medium text-foreground">{project.title}</p>
                          {project.description && <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-warning" aria-hidden="true" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {portfolio.achievements.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No verified achievements yet.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {portfolio.achievements.map((a) => (
                        <div key={a.id} className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3">
                          <Trophy className="h-4 w-4 text-warning" aria-hidden="true" />
                          <span className="text-sm font-medium text-foreground">{a.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Interview rounds</CardTitle>
            </CardHeader>
            <CardContent>
              <InterviewRoundsPanel applicationId={applicant.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
