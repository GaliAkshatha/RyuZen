import { useAppForm } from "@/hooks/useAppForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { Code2, RefreshCw, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Badge } from "@/shared/ui/Badge";
import { Spinner } from "@/shared/components/Spinner";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { flattenApiErrors } from "@/utils/flattenApiErrors";
import { useToast } from "@/hooks/useToast";

import { useMyCodingProfiles } from "@/features/coding-profiles/hooks/useMyCodingProfiles";
import { useLinkCodingProfile } from "@/features/coding-profiles/hooks/useLinkCodingProfile";
import { useSyncCodingProfile } from "@/features/coding-profiles/hooks/useSyncCodingProfile";
import { AcademicLayout } from "@/features/academic-hub/components/AcademicLayout";
import {
  linkCodingProfileSchema,
  type LinkCodingProfileFormValues,
} from "@/features/coding-profiles/schemas/codingProfile.schemas";

/**
 * "Results should be based only on verified institutional data, not
 * self-declared claims" — the same discipline as the rest of Growth
 * Profile. Linking a handle doesn't just save text: the backend
 * genuinely calls the real Codeforces API to confirm it exists before
 * it's ever marked verified, and every stat shown here came from that
 * same real, periodically-refreshed source, never typed in by the
 * student.
 */
export function MyCodingProfilesPage() {
  const { toast } = useToast();

  const { data: profiles, isLoading, isError, error, refetch } = useMyCodingProfiles();
  const { mutate: link, isPending: linking, error: linkError } = useLinkCodingProfile();
  const { mutate: sync, isPending: syncing } = useSyncCodingProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<LinkCodingProfileFormValues>({
    resolver: zodResolver(linkCodingProfileSchema),
    defaultValues: { platform: "CODEFORCES", handle: "" },
  });

  function onSubmit(values: LinkCodingProfileFormValues) {
    link(values, {
      onSuccess: () => {
        toast({ title: "Codeforces profile linked" });
        reset({ platform: "CODEFORCES", handle: "" });
      },
    });
  }

  const fieldErrors = Object.entries(errors).map(
    ([field, err]) => `${field}: ${err?.message ?? "Invalid value."}`,
  );
  const apiErrors = flattenApiErrors(linkError);

  const hasCodeforces = profiles?.some((p) => p.platform === "CODEFORCES");

  if (isError) {
    return (
      <AcademicLayout>
        <ErrorState error={error} onRetry={() => refetch()} />
      </AcademicLayout>
    );
  }

  return (
    <AcademicLayout>
    <div className="relative flex max-w-2xl flex-col gap-6">
      <PageAtmosphere variant="academy" />

      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <Code2 className="h-6 w-6 text-primary" aria-hidden="true" />
        Coding Practice
      </h1>

      {!hasCodeforces && (
        <Card>
          <CardHeader>
            <CardTitle>Link Your Codeforces Handle</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
              {(fieldErrors.length > 0 || apiErrors.length > 0) && (
                <FormErrorSummary errors={[...fieldErrors, ...apiErrors]} />
              )}
              <p className="font-body text-xs text-muted-foreground">
                We'll check this is a real Codeforces account before linking it — a made-up or
                mistyped handle won't be accepted.
              </p>
              <div className="flex gap-2">
                <Input placeholder="Your Codeforces handle" {...register("handle")} className="flex-1" />
                <Button type="submit" disabled={linking}>
                  {linking ? "Verifying…" : "Link"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : !profiles || profiles.length === 0 ? (
        <EmptyState
          title="No coding profiles linked yet"
          description="Link your Codeforces handle above to start building verified coding evidence."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <CardContent className="flex items-center justify-between gap-3 py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm font-medium text-foreground">
                      {profile.platform}
                    </span>
                    <Badge variant="secondary">{profile.handle}</Badge>
                    {profile.verified && <Badge variant="success">Verified</Badge>}
                  </div>
                  <div className="flex gap-4 font-body text-xs text-muted-foreground">
                    <span>Rating: {profile.currentRating ?? "—"}</span>
                    <span>Max: {profile.maxRating ?? "—"}</span>
                    <span>Solved: {profile.problemsSolved ?? "—"}</span>
                    {profile.rank && <span>Rank: {profile.rank}</span>}
                  </div>
                  {profile.lastSyncedAt && (
                    <span className="font-body text-xs text-muted-foreground">
                      Last synced {new Date(profile.lastSyncedAt).toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={syncing}
                    onClick={() =>
                      sync(profile.id, { onSuccess: () => toast({ title: "Profile synced" }) })
                    }
                  >
                    <RefreshCw className="mr-1 h-3 w-3" aria-hidden="true" />
                    {syncing ? "Syncing…" : "Sync Now"}
                  </Button>
                  <a
                    href={`https://codeforces.com/profile/${profile.handle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary"
                    aria-label="View on Codeforces"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </AcademicLayout>
  );
}
