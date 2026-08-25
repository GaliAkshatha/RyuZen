import { useState } from "react";
import { Newspaper, PenSquare, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { useAuth } from "@/domains/auth/AuthContext";
import { useNews } from "@/domains/news/hooks/useNews";
import { useDeleteNews } from "@/domains/news/hooks/useDeleteNews";
import { CreateNewsForm } from "@/domains/news/components/CreateNewsForm";

const CAN_POST_ROLES = ["FACULTY", "ORG_ADMIN", "PLACEMENT_ADMIN"];

/**
 * Real, org-isolated campus news feed - meant to be mounted directly
 * on a dashboard home page (not tucked behind a nav item), matching
 * the explicit request that news be "visible to them in their
 * dashboard." The compose toggle only ever renders for
 * Faculty/Org Admin/Placement Admin (matching the real backend's own
 * CreateNewsUseCase restriction exactly); delete only ever renders
 * for a post's own author or an Org Admin, matching
 * DeleteNewsUseCase's real rule - both are real conveniences mirror-
 * ing backend enforcement, not the actual security boundary.
 */
export function NewsFeedWidget() {
  const { user } = useAuth();
  const { data: news, isLoading, isError, error, refetch } = useNews();
  const { mutate: deleteNews, isPending: isDeleting } = useDeleteNews();
  const [composing, setComposing] = useState(false);

  const canPost = Boolean(user?.role && CAN_POST_ROLES.includes(user.role));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-primary" aria-hidden="true" />
            Campus news
          </span>
          {canPost && (
            <Button size="sm" variant="outline" onClick={() => setComposing((v) => !v)} className="flex items-center gap-1.5">
              <PenSquare className="h-3.5 w-3.5" aria-hidden="true" />
              {composing ? "Cancel" : "Post news"}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {composing ? (
          <CreateNewsForm onPosted={() => setComposing(false)} />
        ) : isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : !news || news.length === 0 ? (
          <EmptyState icon={Newspaper} title="No campus news yet" />
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {news.map((item) => {
              const canDelete = item.authorId === user?.id || user?.role === "ORG_ADMIN";
              return (
                <div key={item.id} className="py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    {canDelete && (
                      <button
                        onClick={() => deleteNews(item.id)}
                        disabled={isDeleting}
                        className="shrink-0 text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                        aria-label="Remove news post"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.content}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {item.authorName} · {item.authorRole.replace("_", " ").toLowerCase()}
                    {item.createdAt && ` · ${new Date(item.createdAt).toLocaleDateString()}`}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
