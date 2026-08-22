import { useState } from "react";
import { Mail, RefreshCw, Ban, UserPlus, Clock, CheckCircle2, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatCard } from "@/shared/components/StatCard";
import { useInvitations } from "@/domains/invitations/hooks/useInvitations";
import { useInviteUser } from "@/domains/invitations/hooks/useInviteUser";
import { useResendInvitation } from "@/domains/invitations/hooks/useResendInvitation";
import { useRevokeInvitation } from "@/domains/invitations/hooks/useRevokeInvitation";
import { InviteUserForm } from "@/domains/invitations/components/InviteUserForm";
import { InvitationStatus } from "@/domains/invitations/invitation.types";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Closes a significant, previously-confirmed gap: this is the actual
 * entry point for how a new person gets into RyuZen at all. Creating
 * a Faculty or Student profile always required an already-existing
 * user account - this page is where that account genuinely gets
 * created, via the real invitation system (email + role, the person
 * accepts and sets their own password - confirmed against
 * AcceptInvitationSchema's real password-strength rule).
 */
export function InvitationsPage() {
  const { data: invitations, isLoading, isError, error, refetch } = useInvitations();
  const { mutate: inviteUser, isPending: isInviting } = useInviteUser();
  const { mutate: resend, isPending: isResending, variables: resendId } = useResendInvitation();
  const { mutate: revoke, isPending: isRevoking, variables: revokeId } = useRevokeInvitation();
  const [inviteError, setInviteError] = useState<AppApiError | null>(null);

  const pending = (invitations ?? []).filter((i) => i.status === InvitationStatus.PENDING).length;
  const accepted = (invitations ?? []).filter((i) => i.status === InvitationStatus.ACCEPTED).length;
  const expired = (invitations ?? []).filter(
    (i) => i.status === InvitationStatus.EXPIRED || i.status === InvitationStatus.REVOKED,
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Invitations</h1>
        <p className="text-sm text-muted-foreground">Invite new people into your organization.</p>
      </div>

      {!isLoading && !isError && invitations && invitations.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={Clock} value={pending} label="Pending" tone="warning" />
          <StatCard icon={CheckCircle2} value={accepted} label="Accepted" tone="success" />
          <StatCard icon={XCircle} value={expired} label="Expired / revoked" tone="destructive" />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserPlus className="h-4 w-4 text-primary" aria-hidden="true" />
            Invite someone
          </CardTitle>
          <CardDescription>They'll receive an email to set their own password and join.</CardDescription>
        </CardHeader>
        <CardContent>
          <InviteUserForm
            isSubmitting={isInviting}
            submitError={inviteError}
            onSubmit={(values) => {
              setInviteError(null);
              inviteUser(values, { onError: (err) => setInviteError(err) });
            }}
          />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Sent invitations</h2>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState error={error} onRetry={() => refetch()} />
        ) : !invitations || invitations.length === 0 ? (
          <EmptyState icon={Mail} title="No invitations sent yet" />
        ) : (
          <div className="flex flex-col gap-2">
            {invitations.map((inv) => (
              <Card key={inv.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">{inv.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {inv.role} · {inv.status}
                    </p>
                  </div>
                  {inv.status === InvitationStatus.PENDING && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isResending && resendId === inv.id}
                        className="flex items-center gap-1.5"
                        onClick={() => resend(inv.id)}
                      >
                        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                        Resend
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isRevoking && revokeId === inv.id}
                        className="flex items-center gap-1.5 text-destructive hover:text-destructive"
                        onClick={() => revoke(inv.id)}
                      >
                        <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                        Revoke
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
