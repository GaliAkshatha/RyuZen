import { useState } from "react";
import { Send } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { ErrorState } from "@/shared/components/ErrorState";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { useToast } from "@/hooks/useToast";

import { useInvitations } from "@/features/invitations/hooks/useInvitations";
import { useInviteUser } from "@/features/invitations/hooks/useInviteUser";
import { useResendInvitation } from "@/features/invitations/hooks/useResendInvitation";
import { useRevokeInvitation } from "@/features/invitations/hooks/useRevokeInvitation";
import { InviteUserForm } from "@/features/invitations/components/InviteUserForm";
import type { InvitationResponseDto } from "@/features/invitations/types/invitation.types";

/**
 * ORG_ADMIN-only, matching the backend route gate exactly. Every
 * action here (invite/resend/revoke) is real - resend genuinely
 * generates a new token and invalidates the old one server-side
 * (InvitationRepository.reissue), and revoke genuinely blocks future
 * acceptance even with a still-valid original token, both confirmed
 * against the backend directly.
 */
export function InvitationListPage() {
  const { toast } = useToast();
  const [showInviteForm, setShowInviteForm] = useState(false);

  const { data: invitations, isLoading, isError, error, refetch } = useInvitations();
  const { mutate: invite, isPending: isInviting, error: inviteError } = useInviteUser();
  const { mutate: resend, isPending: isResending } = useResendInvitation();
  const { mutate: revoke, isPending: isRevoking } = useRevokeInvitation();

  const columns: DataGridColumn<InvitationResponseDto>[] = [
    { key: "email", header: "Email", render: (i) => i.email },
    { key: "role", header: "Role", render: (i) => i.role },
    { key: "status", header: "Status", render: (i) => <StatusBadge status={i.status} /> },
    {
      key: "expiresAt",
      header: "Expires",
      render: (i) => new Date(i.expiresAt).toLocaleDateString(),
      sortable: true,
      sortValue: (i) => new Date(i.expiresAt).getTime(),
    },
    {
      key: "actions",
      header: "",
      render: (i) =>
        i.status === "PENDING" || i.status === "EXPIRED" ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isResending}
              onClick={(e) => {
                e.stopPropagation();
                resend(i.id, { onSuccess: () => toast({ title: "Invitation resent" }) });
              }}
            >
              Resend
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={isRevoking}
              onClick={(e) => {
                e.stopPropagation();
                revoke(i.id, { onSuccess: () => toast({ title: "Invitation revoked" }) });
              }}
            >
              Revoke
            </Button>
          </div>
        ) : null,
    },
  ];

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="academy" />

      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
          <Send className="h-6 w-6 text-primary" aria-hidden="true" />
          Invitations
        </h1>
        <Button onClick={() => setShowInviteForm((v) => !v)}>
          {showInviteForm ? "Cancel" : "Invite User"}
        </Button>
      </div>

      {showInviteForm && (
        <Card>
          <CardHeader>
            <CardTitle>Invite a New User</CardTitle>
          </CardHeader>
          <CardContent>
            <InviteUserForm
              isSubmitting={isInviting}
              error={inviteError}
              onSubmit={(values) =>
                invite(values, {
                  onSuccess: () => {
                    toast({ title: "Invitation sent", description: `Sent to ${values.email}` });
                    setShowInviteForm(false);
                  },
                })
              }
            />
          </CardContent>
        </Card>
      )}

      <DataGrid
        data={invitations ?? []}
        columns={columns}
        getRowId={(i) => i.id}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search by email…"
        getSearchableText={(i) => i.email}
        emptyTitle="No invitations yet"
        emptyDescription="Invited users will appear here until they accept and activate their account."
      />
    </div>
  );
}
