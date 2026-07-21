import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Switch } from "@/shared/ui/Switch";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import type { AppApiError } from "@/types/api";

import {
  createPortfolioProjectSchema,
  updatePortfolioProjectSchema,
  type CreatePortfolioProjectFormValues,
  type UpdatePortfolioProjectFormValues,
} from "@/features/portfolio/schemas/portfolioProject.schemas";
import type { PortfolioProjectResponseDto } from "@/features/portfolio/types/portfolio.types";

interface PortfolioProjectFormProps {
  project?: PortfolioProjectResponseDto;
  isSubmitting: boolean;
  error: AppApiError | null;
  onSubmit: (values: CreatePortfolioProjectFormValues | UpdatePortfolioProjectFormValues) => void;
  onCancel?: () => void;
}

/**
 * `techStack` and `images` are kept as local comma-separated text-input
 * state (not registered with RHF), same reasoning as
 * ExperienceForm.tsx's skills field — a text input can only ever
 * produce a string, but these are string[] fields.
 */
export function PortfolioProjectForm({
  project,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: PortfolioProjectFormProps) {
  const isEdit = Boolean(project);
  const [techStackInput, setTechStackInput] = useState(project?.techStack?.join(", ") ?? "");
  const [imagesInput, setImagesInput] = useState(project?.images?.join(", ") ?? "");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePortfolioProjectFormValues>({
    resolver: zodResolver(isEdit ? updatePortfolioProjectSchema : createPortfolioProjectSchema),
    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? "",
      github: project?.github ?? "",
      liveDemo: project?.liveDemo ?? "",
      video: project?.video ?? "",
      featured: project?.featured ?? false,
    },
  });

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(error);

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit({
          ...values,
          github: values.github?.trim() ? values.github.trim() : undefined,
          liveDemo: values.liveDemo?.trim() ? values.liveDemo.trim() : undefined,
          video: values.video?.trim() ? values.video.trim() : undefined,
          techStack: techStackInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          images: imagesInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      )}
      className="flex flex-col gap-3"
      noValidate
    >
      {(fieldErrors.length > 0 || apiErrors.length > 0) && (
        <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="font-body text-sm font-medium text-foreground">
          Title
        </label>
        <Input id="title" aria-invalid={Boolean(errors.title)} {...register("title")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="font-body text-sm font-medium text-foreground">
          Description (optional)
        </label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="techStack" className="font-body text-sm font-medium text-foreground">
          Tech Stack (comma-separated, optional)
        </label>
        <Input
          id="techStack"
          placeholder="React, Node.js, PostgreSQL"
          value={techStackInput}
          onChange={(e) => setTechStackInput(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="github" className="font-body text-sm font-medium text-foreground">
            GitHub URL (optional)
          </label>
          <Input id="github" placeholder="https://…" {...register("github")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="liveDemo" className="font-body text-sm font-medium text-foreground">
            Live Demo URL (optional)
          </label>
          <Input id="liveDemo" placeholder="https://…" {...register("liveDemo")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="images" className="font-body text-sm font-medium text-foreground">
            Image URLs (comma-separated, optional)
          </label>
          <Input
            id="images"
            placeholder="https://…, https://…"
            value={imagesInput}
            onChange={(e) => setImagesInput(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="video" className="font-body text-sm font-medium text-foreground">
            Video URL (optional)
          </label>
          <Input id="video" placeholder="https://…" {...register("video")} />
        </div>
      </div>

      <Controller
        control={control}
        name="featured"
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Switch id="featured" checked={field.value} onCheckedChange={field.onChange} />
            <label htmlFor="featured" className="font-body text-sm font-medium text-foreground">
              Featured project
            </label>
          </div>
        )}
      />

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Add project"}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
