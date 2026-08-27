import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FileText, ExternalLink, Eye, EyeOff, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { useMyResume } from "@/domains/resume/hooks/useMyResume";
import { useResumeTemplates } from "@/domains/resume/hooks/useResumeTemplates";
import { useGenerateResume, useUpdateResumeVisibility } from "@/domains/resume/hooks/useResumeMutations";
import { ResumeVisibility, type GenerateResumeRequest } from "@/domains/resume/resume.types";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * A confirmed real gap, not a new idea: StudentLayout's own comment
 * explicitly named Resume as a substantial backend domain "not yet
 * re-verified and built fresh in this rebuild" - the backend
 * (get/generate/download/visibility, a real ATS score computed from
 * actual portfolio completeness) already existed complete, with zero
 * student-facing frontend at all.
 *
 * "Generate" here matches what the real backend actually does:
 * GenerateResumeSchema requires a real resumeUrl the student already
 * has (this doesn't produce a PDF from nothing) - a template choice
 * plus a link, after which the server computes a real ATS score from
 * their real skills/projects/experience/education/certifications
 * counts.
 */
export function ResumePage() {
  const { data: resume, isLoading: isLoadingResume, isError, error, refetch } = useMyResume();
  const { data: templates, isLoading: isLoadingTemplates } = useResumeTemplates();
  const { mutate: generate, isPending: isGenerating, error: generateError } = useGenerateResume();
  const { mutate: updateVisibility, isPending: isTogglingVisibility } = useUpdateResumeVisibility();
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, control } = useForm<GenerateResumeRequest>({
    defaultValues: { selectedTemplate: resume?.selectedTemplate ?? "", resumeUrl: resume?.resumeUrl ?? "" },
  });

  function onSubmit(values: GenerateResumeRequest) {
    generate(values, { onSuccess: () => setIsEditing(false) });
  }

  function toggleVisibility() {
    if (!resume) return;
    updateVisibility({ visibility: resume.visibility === ResumeVisibility.PUBLIC ? ResumeVisibility.PRIVATE : ResumeVisibility.PUBLIC });
  }

  if (isLoadingResume || isLoadingTemplates) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const showForm = isEditing || !resume;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Resume</h1>
        <p className="text-sm text-muted-foreground">Link your resume and pick a template - your ATS score reflects your real portfolio.</p>
      </div>

      {resume && !showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
                Your resume
              </span>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                Update
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Template</p>
                <p className="text-sm font-medium text-foreground">{templates?.find((t) => t.id === resume.selectedTemplate)?.name ?? resume.selectedTemplate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ATS score</p>
                <p className="text-sm font-medium text-foreground">{resume.atsScore ?? "—"}/100</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last generated</p>
                <p className="text-sm font-medium text-foreground">{resume.lastGeneratedAt ? new Date(resume.lastGeneratedAt).toLocaleDateString() : "—"}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {resume.resumeUrl && (
                <a
                  href={resume.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  Open resume
                </a>
              )}
              <Button size="sm" variant="outline" disabled={isTogglingVisibility} onClick={toggleVisibility} className="flex items-center gap-1.5">
                {resume.visibility === ResumeVisibility.PUBLIC ? <Eye className="h-3.5 w-3.5" aria-hidden="true" /> : <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />}
                {resume.visibility === ResumeVisibility.PUBLIC ? "Visible to recruiters" : "Hidden from recruiters"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              {resume ? "Update your resume" : "Add your resume"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
              {generateError && (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
                  {(generateError as AppApiError).message}
                </p>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="resume-template">Template</Label>
                <Controller
                  name="selectedTemplate"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={resume?.selectedTemplate ?? ""}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="resume-template" className="max-w-sm">
                        <SelectValue placeholder="Choose a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {(templates ?? []).map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                            {t.premium ? " (premium)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="resume-url">Resume URL</Label>
                <Input id="resume-url" placeholder="https://drive.google.com/..." {...register("resumeUrl", { required: true })} />
                <p className="text-xs text-muted-foreground">A link to your resume file - Google Drive, Dropbox, or anywhere publicly accessible.</p>
              </div>

              <div className="flex gap-3">
                <Button type="submit" size="sm" disabled={isGenerating}>
                  {isGenerating ? "Saving…" : resume ? "Save changes" : "Add resume"}
                </Button>
                {resume && (
                  <Button type="button" size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
