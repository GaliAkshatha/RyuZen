import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, FileText, ExternalLink, Pencil } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import { useToast } from "@/hooks/useToast";

import { useApplyToPlacement } from "@/features/job-applications/hooks/useApplyToPlacement";
import {
  applyToPlacementSchema,
  type ApplyToPlacementFormValues,
} from "@/features/job-applications/schemas/jobApplication.schemas";

import { useMyResume } from "@/features/resume/hooks/useMyResume";

/**
 * The backend genuinely only accepts one field (`resume`, optional -
 * falls back to the student's saved CE6 Resume if left blank,
 * confirmed against ApplyToPlacementDto directly). The real upgrade
 * here isn't inventing new fields the backend doesn't support - it's
 * making that existing fallback behavior visible and real: showing
 * the student's actual saved resume (with its real ATS score) instead
 * of a placeholder hint, so "leave this blank" is a genuine, informed
 * choice rather than a guess.
 */
export function ApplyToPlacementSection({ placementId }: { placementId: string }) {
  const { toast } = useToast();
  const { mutate, isPending, error } = useApplyToPlacement(placementId);
  const { data: resume } = useMyResume();

  const [useCustomUrl, setUseCustomUrl] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useAppForm<ApplyToPlacementFormValues>({
    resolver: zodResolver(applyToPlacementSchema),
    defaultValues: { resume: "" },
  });

  const fieldErrors = errors.resume ? [errors.resume.message ?? "Invalid value."] : [];
  const apiErrors = flattenApiErrors(error);

  return (
    <form
      onSubmit={handleSubmit((values) =>
        mutate(
          { resume: values.resume?.trim() ? values.resume.trim() : undefined },
          { onSuccess: () => toast({ title: "Application submitted" }) },
        ),
      )}
      className="flex flex-col gap-3"
      noValidate
    >
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      {resume?.resumeUrl && !useCustomUrl ? (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="font-body text-sm font-medium text-foreground">
                Your saved resume will be used
              </span>
            </div>
            <a
              href={resume.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-body text-xs text-primary underline underline-offset-4"
            >
              View <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
          {resume.atsScore !== undefined && (
            <p className="font-body text-xs text-muted-foreground">
              ATS score: <span className="font-medium text-foreground">{resume.atsScore}</span>
            </p>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-fit"
            onClick={() => setUseCustomUrl(true)}
          >
            <Pencil className="mr-1.5 h-3 w-3" aria-hidden="true" />
            Use a different resume for this application
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="resume" className="font-body text-sm font-medium text-foreground">
            Resume URL {resume?.resumeUrl ? "" : "(optional)"}
          </label>
          <Input id="resume" placeholder="https://…" {...register("resume")} />
          {!resume?.resumeUrl && (
            <p className="font-body text-xs text-muted-foreground">
              You don't have a saved resume yet — leave this blank to apply without one, or{" "}
              <Link to="/app/career/resume" className="text-primary underline underline-offset-4">
                generate one first
              </Link>
              .
            </p>
          )}
          {resume?.resumeUrl && useCustomUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-fit"
              onClick={() => setUseCustomUrl(false)}
            >
              Use my saved resume instead
            </Button>
          )}
        </div>
      )}

      <Button type="submit" disabled={isPending} className="self-start">
        <Send className="mr-2 h-4 w-4" aria-hidden="true" />
        {isPending ? "Applying…" : "Apply"}
      </Button>
    </form>
  );
}
