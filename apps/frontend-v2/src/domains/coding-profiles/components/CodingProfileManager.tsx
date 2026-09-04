import { useState } from "react";
import { useForm } from "react-hook-form";
import { Code2, RefreshCw, ShieldCheck, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Skeleton } from "@/shared/components/Skeleton";
import { useMyCodingProfiles } from "@/domains/coding-profiles/hooks/useMyCodingProfiles";
import { useLinkCodingProfile, useSyncCodingProfile } from "@/domains/coding-profiles/hooks/useCodingProfileMutations";
import { CodingPlatform } from "@/domains/coding-profiles/codingProfile.types";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Real gap filled: link/list/sync all existed on the backend (real
 * Codeforces public-API verification - a typed handle is only ever
 * "verified" once LinkCodingProfileUseCase confirms it actually
 * exists) with zero frontend at all. Only Codeforces is offered here,
 * matching the real backend's own current restriction exactly - not
 * offering LeetCode/HackerRank since submitting either would just be
 * rejected by the real validator.
 */
export function CodingProfileManager() {
  const { data: profiles, isLoading } = useMyCodingProfiles();
  const { mutate: link, isPending: isLinking, error: linkError } = useLinkCodingProfile();
  const { mutate: sync, isPending: isSyncing, variables: syncingId } = useSyncCodingProfile();
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset } = useForm<{ handle: string }>();

  function onSubmit(values: { handle: string }) {
    link(
      { platform: CodingPlatform.CODEFORCES, handle: values.handle },
      {
        onSuccess: () => {
          reset();
          setShowForm(false);
        },
      },
    );
  }

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  const hasCodeforces = (profiles ?? []).some((p) => p.platform === CodingPlatform.CODEFORCES);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" aria-hidden="true" />
            Coding profile
          </span>
          {!hasCodeforces && (
            <Button size="sm" variant="outline" onClick={() => setShowForm((v) => !v)}>
              {showForm ? "Cancel" : "Link Codeforces"}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
            {linkError && (
              <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
                {(linkError as AppApiError).message}
              </p>
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cf-handle">Codeforces handle</Label>
              <Input id="cf-handle" placeholder="tourist" {...register("handle", { required: true })} />
              <p className="text-xs text-muted-foreground">We verify this is a real handle before linking it - a mistyped or fake handle won't link.</p>
            </div>
            <Button type="submit" size="sm" disabled={isLinking} className="w-fit">
              {isLinking ? "Verifying…" : "Link and verify"}
            </Button>
          </form>
        ) : !profiles || profiles.length === 0 ? (
          <p className="text-sm text-muted-foreground">No coding profile linked yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {profiles.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div>
                  <p className="flex items-center gap-1.5 font-medium text-foreground">
                    <a
                      href={`https://codeforces.com/profile/${p.handle}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      {p.handle}
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                    {p.verified && (
                      <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                        <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                        Verified
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.currentRating !== undefined ? `Rating ${p.currentRating}${p.rank ? ` (${p.rank})` : ""}` : "Not synced yet"}
                    {p.problemsSolved !== undefined && ` · ${p.problemsSolved} solved`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isSyncing && syncingId === p.id}
                  onClick={() => sync(p.id)}
                  className="flex items-center gap-1.5"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncing && syncingId === p.id ? "animate-spin" : ""}`} aria-hidden="true" />
                  {isSyncing && syncingId === p.id ? "Syncing…" : "Sync"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
