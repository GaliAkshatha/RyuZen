import { ExternalLink, FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { useToast } from "@/hooks/useToast";

import { useMyResume } from "@/features/resume/hooks/useMyResume";
import { useGenerateResume } from "@/features/resume/hooks/useGenerateResume";
import { useDownloadResume } from "@/features/resume/hooks/useDownloadResume";
import { useResumeTemplates } from "@/features/resume/hooks/useResumeTemplates";
import { GenerateResumeForm } from "@/features/resume/components/GenerateResumeForm";
import { ResumeVisibilityToggle } from "@/features/resume/components/ResumeVisibilityToggle";

export function MyResumePage() {
  const { data: resume, isLoading, isError, error, refetch } = useMyResume();
  const { data: templates } = useResumeTemplates();
  const {
    mutate: generateResume,
    isPending: isGenerating,
    error: generateError,
  } = useGenerateResume();
  const { mutate: downloadResume, isPending: isDownloading } = useDownloadResume();
  const { toast } = useToast();

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  // GetMyResumeUseCase throws a 404 "You have not generated a resume
  // yet." for a brand-new user — an expected state, not an error.
  const hasNoResumeYet = isError && error?.status === 404;

  if (isError && !hasNoResumeYet) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const templateName = templates?.find((t) => t.id === resume?.selectedTemplate)?.name;

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
        My Resume
      </h1>

      {!hasNoResumeYet && resume?.resumeUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Current Resume</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="font-body text-sm text-muted-foreground">
              {templateName ? `Template: ${templateName}` : null}
              {resume.lastGeneratedAt && (
                <> · Last updated {new Date(resume.lastGeneratedAt).toLocaleDateString()}</>
              )}
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={isDownloading}
                onClick={() =>
                  downloadResume(undefined, {
                    onSuccess: (downloaded) => {
                      if (downloaded.resumeUrl)
                        window.open(downloaded.resumeUrl, "_blank", "noopener");
                    },
                  })
                }
              >
                <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                {isDownloading ? "Opening…" : "Download"}
              </Button>
              <ResumeVisibilityToggle visibility={resume.visibility} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{hasNoResumeYet ? "Create Your Resume" : "Update Resume"}</CardTitle>
        </CardHeader>
        <CardContent>
          {hasNoResumeYet && (
            <p className="mb-3 font-body text-sm text-muted-foreground">
              You haven't created a resume yet. Choose a template and provide a link to your resume
              file.
            </p>
          )}
          <GenerateResumeForm
            templates={templates ?? []}
            isSubmitting={isGenerating}
            error={generateError}
            onSubmit={(values) =>
              generateResume(values, { onSuccess: () => toast({ title: "Resume saved" }) })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
