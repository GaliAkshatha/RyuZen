import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { useCreateNews } from "@/domains/news/hooks/useCreateNews";
import { createNewsSchema, type CreateNewsFormValues } from "@/domains/news/newsSchema";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Real, role-gated: only ever rendered by NewsFeedWidget for callers
 * whose role is FACULTY/ORG_ADMIN/PLACEMENT_ADMIN - the real backend
 * enforces this identically, so this form is a genuine convenience,
 * not the actual security boundary.
 */
export function CreateNewsForm({ onPosted }: { onPosted?: () => void }) {
  const { mutate: createNews, isPending } = useCreateNews();
  const [submitError, setSubmitError] = useState<AppApiError | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateNewsFormValues>({
    resolver: zodResolver(createNewsSchema),
  });

  function onSubmit(values: CreateNewsFormValues) {
    setSubmitError(null);
    createNews(values, {
      onSuccess: () => {
        reset();
        onPosted?.();
      },
      onError: (err) => setSubmitError(err),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      {submitError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">{submitError.message}</p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="news-title">Title</Label>
        <Input id="news-title" {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="news-content">Content</Label>
        <textarea
          id="news-content"
          rows={4}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          {...register("content")}
        />
        {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      </div>

      <Button type="submit" size="sm" disabled={isPending} className="mt-1 flex w-fit items-center gap-1.5">
        <Send className="h-3.5 w-3.5" aria-hidden="true" />
        {isPending ? "Posting…" : "Post news"}
      </Button>
    </form>
  );
}
